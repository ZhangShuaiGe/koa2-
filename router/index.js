
const router = require("koa-router")();
const PostRouter = require("koa-router")();
const web = require("~/controller/web.js");
const {resJson,sendEmail,upload} = require("../controller/utils");
const jwt = require('jsonwebtoken'); //生成token
const secret = 'jwtlihailewodege'; //加密规则
const request = require("request");

// 首页
router.all("/",web.index);
// 文章详情
router.get("/articleDetail",web.articleDetail);
// 登录
router.get("/login",web.login);
// 注册
router.get("/register",web.register);
//退出登录
router.get("/loginOut",web.loginOut);
//忘记密码
router.get("/forget",web.forget);
//网页抓取工具
router.get("/webCapture",web.webCapture);

// post
PostRouter.prefix('/api');

PostRouter.use( async (ctx,next) => {
    //做登录验证的路由
    const verify = [
        "/api/replay",
    ];
    if(verify.includes(ctx.url)){

        try {

            ctx.user = jwt.verify(ctx.headers.authorization, secret);  // 解密payload，获取存入的user信息
            // console.log("=======",ctx.user);

            //单点登录
            var status = await new Promise(function (resolve,reject) {
                redisClient.get(ctx.user.email,async function (err,getToken) {
                    if(err) {
                        resJson(ctx,-1,"会话过期,请重新登录");
                        reject(false);
                    } else {

                        if(getToken != ctx.headers.authorization){
                            resJson(ctx,-1,"会话过期,请重新登录");
                            reject(false);
                        } else {
                            resolve(true);
                        }

                    }
                });
            }).then( data => {
                return true;
            }).catch(err => {
                return false;
            });

            if (status) {
                await next();
            } else {
                resJson(ctx,-1,"会话过期,请重新登录");
            }

        } catch (err) {
            if(ctx.headers.authorization){
                resJson(ctx,-1,"会话过期,请重新登录");
            } else {
                resJson(ctx,0,"请先登录！");
            }
        }

    } else {
        await next();
    }
});

PostRouter.post("/test", (ctx) => {
    console.log("进入！！！！！！");
    var a = sendEmail("1071296726@qq.com");
    console.log("aaa=====",a);
});

// 微信登录
PostRouter.post("/wxLogin", async (ctx) => {
    console.log(ctx.request.body.code);
    let appid = "wx5b3c23f56e5cdd45";
    let secret = "82e298b0d5401e8b0992a9ddcbbe6171";
    let js_code = ctx.request.body.code;
    let result = await request({
        method: 'GET',
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`,
    }, (error, response, body) => {
        if (error) {
            error_logger.error("小程序登录异常：" + error);
            console.error('小程序登录异常:', error);
            resJson(ctx,0,"登录异常！");
            return false;
        }
        console.log('Upload successful!  Server responded with:', body);
        return true;
    });

    if (result) {
        resJson(ctx,1);
    } else {
        resJson(ctx,0);
    }

});

// 登录 post
PostRouter.post("/login",web.apiLogin);

// 注册 post
PostRouter.post("/register",web.apiRegister);

//回复
PostRouter.post("/replay",web.replay);

//验证码
PostRouter.post("/vercode",web.vercode);

//首页菜单列表
PostRouter.post("/menuList",web.menuList);

//友情链接列表
PostRouter.post("/blogrollList",web.blogrollList);

//工具库链接 列表
PostRouter.post("/toolList",web.toolList);

//网页抓取接口
PostRouter.post("/webCapture",upload().single('file'),web.apiWebCapture);

// get 路由
exports.GetRouter = router;
// post 路由
exports.PostRouter = PostRouter;