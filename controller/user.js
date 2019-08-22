const request = require("request");
const {resJson} = require("~/controller/utils");
const {jwtToken,queryGithubUser,queryUser} = require("~/model/user");
const uuidv1 = require('uuid/v1');
const {articleReplyDelete} = require("~/model/article");
/**
 * github 登录
 * @param ctx
 * @returns {Promise.<void>}
 */
exports.gethubLogin = async ctx => {
    // 获取令牌
    let access_token = await new Promise((resolve,reject)=>{
        try{
            request.post('https://github.com/login/oauth/access_token', {
                form:{
                    "client_id":"cd5ff8839b5e6448b7f3",
                    "client_secret":"a193331ff8ce801dd36fa1398db3a62643dedbdc",
                    "code":ctx.request.body.code,
                    "state":ctx.request.body.state,
                }
            }, function (err,httpResponse,body) {
                if(err){
                    error_logger.error(err);
                    console.log("报错1：",err)
                    return;
                }
                console.log(body);
                resolve(body);
            })
        } catch (e) {
            error_logger.error(e);
            console.log("报错2：" + e);
            reject(e);
        }
    });

    //拿令牌 获取github 用户信息
    let github_val = await new Promise((resolve,reject)=>{
        try{
            request({
                url:"https://api.github.com/user?" + access_token,
                headers: {
                    'User-Agent':"ZhangShuaiGe"
                }
            }, function (error, response, body) {
                resolve(JSON.parse(body));
            });
        } catch (err){
            console.log("报错3：" + err);
            error_logger.error(err);
            reject(err);
        }
    });

    console.log("github用户信息:" + github_val);
    info_logger("github用户信息:" + github_val);

    //查询用户名是否存在, 不存在创建
    let {login,email,avatar_url,created_at} = github_val;
    let uuid = uuidv1().replace(/\-/g,"");
    await githubUserModel.findOrCreate({
        where:{
            email: email,
        },
        defaults:{
            username: login,
            email: email,
            avatar_url: avatar_url,
            github_createTime: created_at,
            user_uuid: uuid,
        }
    })
    .spread((user, created) => {

        let token = jwtToken({
            nikename:login,
            email:email
        });

        // 存昵称到客户端，全局要用, cookie 不能设置中文 ，转为 Unicode 字符串
        ctx.cookies.set("nikename",encodeURI(login),{
            maxAge:3*60*60*1000, //保持和session时间一致
            httpOnly:false //设置为false 客户端 才可以读取到
        });

        //token
        ctx.cookies.set("token",token,{
            maxAge:3*60*60*1000,
            httpOnly:false
        });

        //头像信息
        ctx.cookies.set("avatarUrl",avatar_url,{
            maxAge:3*60*60*1000,
            httpOnly:false
        });
    });

    resJson(ctx,1);

};

/**
 * github 提示登录页
 * @param ctx
 */
exports.showGethubLogin = ctx => {
    ctx.render("user/githubLogin")
};

/**
 *查询github用户信息
 * @param ctx
 */
exports.queryGithubUser = async ctx => {
    let data = await queryGithubUser({
        user_uuid: ctx.request.body.user_uuid
    })
    if(data){
        resJson(ctx,1,data);
    }else{
        resJson(ctx,0,"查询失败！");
    }
};

/**
 *查询 注册 用户信息
 * @param ctx
 */
exports.queryUser = async ctx => {
    let data = await queryUser({
        user_uuid: ctx.request.body.user_uuid
    })
    if(data){
        resJson(ctx,1,data);
    }else{
        resJson(ctx,0,"查询失败！");
    }
};

/**
 * 聊天室
 *
 */
exports.chatroom = ctx => {
    ctx.render("chatRoom/index");
};

