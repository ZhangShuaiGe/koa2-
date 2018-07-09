// const mysql = require("./mysql");
const {resJson,md5,captchapng,dateformat} = require("./utils");
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
            return {type: ctx.query.type};
        }
        else{
            return {};
        }
    }

    await ArticleModel.findAndCountAll({
        attributes:{exclude: ["content"]},
        limit:15,
        offset: currpage * 15 || 0, //跳过的数据数量
        order:[['ID','DESC']],
        where: where(),
    }).then( data => {
         ctx.render("index",{
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
    await ArticleModel.findAndCountAll({
        where:{
            id: ctx.query.id
        },
        include: [{
            model: ArticleReplyModel,
            as: 'replay',
        }]
    }).then( data => {
        ctx.render("article/detail",{
            "data":data.rows[0],
            "count":data.count,
        });
    }).catch( err => {
        console.log("报错:",err);
        error_logger.error(err);
    });
};

// 登录
exports.login = async(ctx) => {
    if (ctx.method == "POST") {

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

            if(data){
                // 登录邮箱是唯一
                ctx.session.TOKEN = md5(email);
                //存储登录邮箱 留言要用
                ctx.session.email = email;
                // 存昵称node
                let nikename = data.dataValues.username;
                ctx.session.nikename = nikename;
                // 存昵称到客户端，全局要用, cookie 不能设置中文 ，转为 Unicode 字符串
                ctx.cookies.set("nikename",encodeURI(nikename),{
                    maxAge:60*60*1000, //保持和session时间一致
                    httpOnly:false //设置为false 客户端 才可以读取到
                });
                resJson(ctx,1);
            }else {
                resJson(ctx,0,"用户名或密码错误！");
            }

        }).catch( err => {
            console.log("进入err:",err);
            resJson(ctx,0,"用户名或密码错误！");
        })

    } else {
        //调用验证码
        let vercode = captchapng(ctx);
        ctx.render("user/login",{
            "vercode":vercode
        });
    }

};

// 注册
exports.register = async (ctx) => {

    if(ctx.method == "POST"){

        let captchapng = ctx.cookies.get('vercode');

        let {email,username,password,repass,vercode} = ctx.request.body;

        if(password != repass){
            resJson(ctx,0,"两次密码不一致！");
            return;
        }

        if(captchapng != vercode){
            ctx.body = {
                "resultCode":0,
                "resultMsg":"验证码错误"
            };
            return;
        }

        //查询用户名是否存在, 不存在创建
        await  WebUserModel.findOrCreate({
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

    } else {

        //调用验证码
        let vercode = captchapng(ctx);
        // get请求 渲染页面
        ctx.render("user/register",{
            "vercode": vercode
        });

    }
};

//回复
exports.replay = async(ctx) => {
    let {articleId,content} = ctx.request.body;

    if(ctx.session.TOKEN){
        await ArticleReplyModel.create({
            articleId:articleId,
            reply_con: content,
            email:ctx.session.email,
            nikename:ctx.session.nikename
        }).then( data => {
            resJson(ctx,1);
        });
    }else{
        resJson(ctx,0,"请先登录！");
    }
};

// 前台退出登录
exports.loginOut = async(ctx) => {
    ctx.session.TOKEN = "";
    ctx.cookies.set("nikename","");
    ctx.redirect("/");
};
