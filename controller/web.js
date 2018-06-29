const mysql = require("./mysql");
const utils = require("./utils");
const {resJson} = require("./utils");

// 首页
exports.index = async (ctx) => {
    let result = {};

    // 首页分页控制
    if(ctx.query.page){
        ctx.query.page = Number(ctx.query.page) - 1;
    }else{
        ctx.query.page = 0;
    }

    // 根据分页加载首页 文章列表
    let query = {page:ctx.query.page,type:ctx.query.type};
    let list = mysql.articleList(query).then((data)=>{
        return data;
    });

    //查询总页数，分页插件要用，传的字段是(类型,表名)
    let queryPage = {condition:ctx.query.type,from:"ARTICLE_CONTENT"};
    let count = mysql.pageCount(queryPage).then((data)=>{
        return data;
    });

    // all 的目的是让上面 两条 sql 查询 异步执行
    await Promise.all([list,count]).then( (data) => {
        result.data = data[0];
        result.count = data[1][0].count;
    }).catch((data)=>{
        error_logger.error(data);
    });

    await ctx.render("index",{
        "data":result.data,
        "count": result.count,
        "type":ctx.query.type
    });

};

//文章详情
exports.articleDetail = async (ctx) => {
    // 文章信息
    let query1 = mysql.articleDetail(ctx.query.id).then( (data) => {
        return data;
    });
    //查询当前文章的 留言信息
    let query2 = mysql.queryreplay(ctx.query.id).then((data)=>{
        return data;
    });

    await Promise.all([query1,query2]).then((data)=>{
        ctx.render("article/detail",{
            "data":data[0][0],
            "replay":data[1]
        });
    })
};

// 登录
exports.login = async(ctx) => {

    if (ctx.method == "POST") {
        let captchapng = ctx.cookies.get('vercode');
        let {email,password,vercode} = ctx.request.body;
        if(captchapng != vercode){
            resJson(ctx,0,"验证码错误!");
            return;
        }
        // 校验 用户名 和密码
        await mysql.login([email,utils.md5(password)]).then( async(data) => {
            if (data.length) {

                // 登录邮箱是唯一
                ctx.session.TOKEN = utils.md5(email);
                //存储登录邮箱 留言要用
                ctx.session.email = email;
                // 查询用户昵称
                let nikename = await mysql.queryUserNickname(email).then((data) => {
                    return data[0].username;
                });
                // 存昵称node
                ctx.session.nikename = nikename;
                // 存昵称到客户端，全局要用, cookie 不能设置中文 ，转为 Unicode 字符串
                ctx.cookies.set("nikename",encodeURI(nikename),{
                    maxAge:60*60*1000, //保持和session时间一致
                    httpOnly:false //设置为false 客户端 才可以读取到
                });
                resJson(ctx,1);

            } else {
                resJson(ctx,0,"用户名或密码错误！");
            }
        });
    } else {
        //调用验证码
        let vercode = utils.captchapng(ctx);
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
        // 查询用户名是否存在
        let queryUserName = await mysql.queryUserName([email]).then((data)=>{
            if(data.length){
                resJson(ctx,0,"邮箱已存在！");
                return true;
            }
        });

        // 如果存在，打断后续执行
        if(queryUserName){
            return;
        }

        // 注册信息存入sql
        await mysql.register([email,username,utils.md5(password)]).then(function (data) {
            console.log(data);
            resJson(ctx,1,{resultMsg:"注册成功！"});
        });

    } else {

        //调用验证码
        let vercode = utils.captchapng(ctx);
        // get请求 渲染页面
        ctx.render("user/register",{
            "vercode": vercode
        });

    }
};

//回复
exports.replay = async(ctx) => {
    let {id,content} = ctx.request.body;
    let date = utils.dateformat(new Date());
    if(ctx.session.TOKEN){
        await mysql.replay([id,content,ctx.session.email,date,ctx.session.nikename]).then( (data) => {
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
