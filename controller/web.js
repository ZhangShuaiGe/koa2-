const jwt = require('jsonwebtoken'); //生成token
const secret = 'jwtlihailewodege'; //加密规则
const {resJson,md5,captchapng,dateformat} = require("./utils");
const sequelize = require("../config/dbConfig");
const Op = sequelize.Op;

// 首页
exports.index = async (ctx) => {
    // 当前页
    let currpage = 0;
    if(ctx.query.page){
        currpage = Number(ctx.query.page) - 1;
    }
    // 动态where
    function where() {
        if(ctx.query.type){
            //如果有文章类型
            return {type: ctx.query.type};
        }else if(ctx.query.serch){
            //如果有 搜索参数
            return {
                [Op.or]:[
                    {
                        title:{
                            [Op.like]: `%${ctx.query.serch}%`,
                        }
                    },
                    {
                        content:{
                            [Op.like]: `%${ctx.query.serch}%`,
                        }
                    }
                ],

            }
        }
        else {
            return {};
        }
    }

    await ArticleModel.findAndCountAll({
        attributes:{exclude: ["content"]},
        limit:15,
        offset: currpage * 15 || 0, //跳过的数据数量
        order:[['istop','DESC'],['ID','DESC']],
        where: where(),
    }).then( data => {
         ctx.render("home/index",{
            "data":data.rows,
            "count": data.count,
            "type":ctx.query.type
         });
    }).catch( err => {
        error_logger.error(err);
    });
};

//文章详情
exports.articleDetail = async (ctx) => {
    // 当前页
    let currpage = 0;
    if(ctx.query.page){
        currpage = Number(ctx.query.page) - 1;
    }

    //异步更新阅读数
    sequelize.query(`update article_content set browse = browse+1 where id = ${ctx.query.id}`);

    // 查询对应文章的留言总数
    let reply_conut = await ArticleReplyModel.count({
        where:{
            articleId: ctx.query.id
        }
    }).then((data)=>{
        return data;
    });

    // 查询文章内容
    await ArticleModel.findAndCountAll({
        where:{
            id: ctx.query.id
        },
        // 查询关联的留言
        include: [{
            model: ArticleReplyModel,
            as: 'replay',
            order:[['ID','DESC']],
            limit:15,
            offset: currpage * 15 || 0, //跳过的数据数量
        }]
    }).then( data => {
        ctx.render("article/detail",{
            "data":data.rows[0],
            "count":reply_conut,
        });
    }).catch( err => {
        console.log("报错:",err);
        error_logger.error(err);
    });
};

// 登录
exports.login = async(ctx) => {
    //调用验证码
    let vercode = captchapng(ctx);
    ctx.render("user/login",{
        "vercode":vercode
    });
};

//忘记密码
exports.forget = async(ctx) => {
    //调用验证码
    let vercode = captchapng(ctx);
    ctx.render("user/forget",{
        "vercode":vercode
    });
};

//网页抓取
exports.webCapture = async(ctx) => {
    ctx.render("tool/webCapture");
};

//登录 post
exports.apiLogin = async(ctx) => {

    let captchapng = ctx.cookies.get('vercode');

    // 获取数据
    let {email,password,vercode} = ctx.request.body;

    // 验证码校验
    if(captchapng != vercode){
        resJson(ctx,0,"验证码错误!");
        return;
    }

    // 校验 用户名 和密码
    await WebUserModel.findOne({
        where:{
            email: email,
            password: md5(password),
        }
    }).then( data => {
        if (data) {
            // 存昵称node
            let nikename = data.dataValues.username;

            // 创建token
            let token = jwt.sign({
                email: email,
                nikename:nikename,
            }, secret ,{ expiresIn: 60 * 60 });

            redisClient.set(email,token,function (err,res) {
                if(err){
                    error_logger.error(err);
                } else {
                    info_logger.info({"email":email,"token":token},"token已存入");
                }
            });
            redisClient.expire(email, 60*60); //过期时间1小时


            // 存昵称到客户端，全局要用, cookie 不能设置中文 ，转为 Unicode 字符串
            ctx.cookies.set("nikename",encodeURI(nikename),{
                maxAge:60*60*1000, //保持和session时间一致
                httpOnly:false //设置为false 客户端 才可以读取到
            });

            //token 客户端要读取放到 header 里 ，cookie不可以跨域
            ctx.cookies.set("token",token,{
                maxAge:60*60*1000,
                httpOnly:false
            });

            resJson(ctx,1);
        } else {
            resJson(ctx,0,"用户名或密码错误！");
        }

    }).catch( err => {
        console.log("进入err:",err);
    })
};

// 注册
exports.register = async (ctx) => {
    //调用验证码
    let vercode = captchapng(ctx);
    // get请求 渲染页面
    ctx.render("user/register",{
        "vercode": vercode
    });
};

// 注册 post
exports.apiRegister = async (ctx) => {

    let captchapng = ctx.cookies.get('vercode');

    let {email,username,password,repass,vercode} = ctx.request.body;

    if(password != repass){
        resJson(ctx,0,"两次密码不一致！");
        return;
    }

    if(captchapng != vercode){
        resJson(ctx,0,"验证码错误！");
        return;
    }

    //查询用户名是否存在, 不存在创建
    await WebUserModel.findOrCreate({
        where:{
            email: email,
        },
        defaults:{
            email: email,
            password: md5(password),
            username: username
        }
    })
    .spread((user, created) => {
        if(created){
            resJson(ctx,1,{resultMsg:"注册成功！"});
        }else{
            resJson(ctx,0,"邮箱已存在！");
        }
    });
};

//回复
exports.replay = async(ctx) => {
    let {articleId,content} = ctx.request.body;

    let {email,nikename} = ctx.user;
    if(ctx.user){
        await ArticleReplyModel.create({
            articleId:articleId,
            reply_con: content,
            email:email,
            nikename:nikename
        }).then( data => {
            resJson(ctx,1);
        });
    } else {
        resJson(ctx,0,"请先登录！");
    }
};

// 前台退出登录
exports.loginOut = async(ctx) => {
    ctx.session.TOKEN = "";
    ctx.cookies.set("nikename","");
    ctx.redirect("/");
};

//获取验证码
exports.vercode = async(ctx) => {
    let imgURL = captchapng(ctx);
    resJson(ctx,1,{url:imgURL});
};

//菜单列表
exports.menuList = async(ctx) => {
    await ArticleTypeModel.findAll({
        order:[['sort','asc']],
    }).then( res => {
        resJson(ctx,1,res);
    });
};

//友链列表
exports.blogrollList = async(ctx) => {
    await WebBlogroll.findAll({
        order:[['sort','DESC']],
    }).then( res => {
        resJson(ctx,1,res);
    });
};

//工具库链接 列表
exports.toolList = async(ctx) => {
    await WebTool.findAll({
        order:[['sort','DESC']],
    }).then( res => {
        resJson(ctx,1,res);
    });
};
