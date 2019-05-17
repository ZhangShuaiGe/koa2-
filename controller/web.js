const {resJson,md5,captchapng,dateformat} = require("./utils");
const {jwtToken} = require("~/model/user");
const {uuid} = require("~/model/utils");

//网页抓取 url
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

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
            let {username,user_uuid} = data.dataValues;
            let token = jwtToken({
                nikename:username,
                user_uuid:user_uuid
            });

            // 存昵称到客户端，全局要用, cookie 不能设置中文 ，转为 Unicode 字符串
            ctx.cookies.set("nikename",encodeURI(username),{
                maxAge:3*60*60*1000, //保持和session时间一致
                httpOnly:false //设置为false 客户端 才可以读取到
            });

            //token 客户端要读取放到 header 里 ，cookie不可以跨域
            ctx.cookies.set("token",token,{
                maxAge:3*60*60*1000,
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
            username: username,
            user_uuid:uuid(),
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

    let {articleUuid,content,replay_uuid,parent_id} = ctx.request.body;
    console.log(ctx.request.body);
    let {user_uuid} = ctx.user;
    if(ctx.user){
        await ArticleReplyModel.create({
            articleUuid:articleUuid,
            reply_con: content,
            user_uuid:user_uuid,
            replay_uuid:replay_uuid,
            parent_id:parent_id,
        }).then( data => {
            resJson(ctx,1);
        }).catch(e =>{
            console.log("报错:" + e);
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

//网页抓取 api
exports.apiWebCapture = async (ctx) => {
    console.log(1111,ctx.request.body);
    console.log(2222,ctx.req.body);
    //
    // console.log("request====",ctx.request);
    // console.log("req====",ctx.req);
    // console.log(222222,ctx.request.body);

    // let {url,staticUrl} = ctx.request.body;
    //
    // url = url + "/";
    // try {
    //     request(url, function (error, response, body) {
    //
    //         if (response.statusCode == "200") {
    //
    //             //毫秒
    //             var time = Date.parse(new Date());
    //
    //             // 提前创建文件夹
    //             fs.mkdirSync("./static/" + time);
    //             fs.mkdirSync("./static/" + time + "/images");
    //             fs.mkdirSync("./static/" + time + "/js");
    //             fs.mkdirSync("./static/" + time + "/css");
    //             fs.writeFile("./static/" + time + "/index.html" , body,function (err) {
    //                if(err){
    //                    console.log("写入错误：" + err);
    //                }
    //                console.log("写入成功！");
    //             });
    //             // 获取内容
    //             let $ = cheerio.load(body);
    //
    //             let img = $("img[src != '']");
    //             capture(img);
    //
    //             let css = $("link[href != '']");
    //             capture(css);
    //
    //             let js = $("script[src != '']");
    //             capture(js);
    //
    //             function capture (target) {
    //
    //                 //爬取资源
    //                 function create(name,path) {
    //                     if(name.includes("?")){
    //                         name = name.substring(0,name.indexOf("?"));
    //                     }
    //                     console.log(111111,path);
    //                     console.log(222222,name);
    //                     if(name.includes("css")){
    //
    //                         try {
    //                             request(path).pipe(fs.createWriteStream('./static/' + time + "/css/" + name));
    //                         } catch(err) {
    //                             console.log("1报错：" + err);
    //                         }
    //
    //                     }else if(name.includes("js")){
    //
    //                         try {
    //                             request(path).pipe(fs.createWriteStream('./static/' + time + "/js/" + name));
    //                         } catch (err) {
    //                             console.log("2报错：" + err);
    //                         }
    //
    //                     } else {
    //
    //                         try {
    //                             request(path).pipe(fs.createWriteStream('./static/' + time + "/images/" + name));
    //                         } catch (err) {
    //                             console.log("3报错：" + err);
    //                         }
    //
    //                     }
    //                 }
    //
    //                 for (let i = 0 ; i < target.length; i++) {
    //
    //                     let getUrl = "";
    //
    //                     if (target.eq(i).attr("href")) {
    //
    //                         getUrl = target.eq(i).attr("href");
    //
    //                     } else if (target.eq(i).attr("src")) {
    //
    //                         getUrl = target.eq(i).attr("src");
    //
    //                     }
    //
    //                     //获取文件名字和后缀 xxx.css || xxx.jpg || xxx.js
    //                     let name = getUrl.substring(getUrl.lastIndexOf("/") + 1);
    //
    //                     if(getUrl.includes("https") || getUrl.includes("http")){
    //
    //                         create(name,getUrl);
    //
    //                     }else if(getUrl.includes("//")){
    //
    //                         getUrl = "https:" + getUrl;
    //
    //                         create(name,getUrl);
    //
    //                     }else{
    //
    //                         getUrl = url + getUrl;
    //
    //                         create(name,getUrl);
    //                     }
    //
    //                 }
    //             }
    //         }
    //         // console.log('error:', error);
    //         // console.log('statusCode:', response && response.statusCode);
    //         // console.log('body:', body);
    //     });
    // } catch (err) {
    //     error_logger.error("报错：" + err);
    //     console.log("报错：" + err);
    // }

};
