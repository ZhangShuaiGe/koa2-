const router = require("koa-router")();
const PostRouter = require("koa-router")();
const web = require("../controller/web");
const {resJson,sendEmail} = require("../controller/utils");
const jwt = require('jsonwebtoken'); //生成token
const secret = 'jwtlihailewodege'; //加密规则

// 首页
router.get("/",web.index);
// 文章详情
router.get("/articleDetail",web.articleDetail);
// 登录
router.get("/login",web.login);
// 注册
router.get("/register",web.register);
//退出登录
router.get("/loginOut",web.loginOut);

// post
PostRouter.prefix('/api');

PostRouter.use( async (ctx,next) => {
    // 登录，注册，验证码 不做登录验证
    if(ctx.url == "/api/login" || ctx.url == "/api/register" || ctx.url == "/api/vercode" || ctx.url == "/api/test"){
        await next();
    } else {
        try {
            ctx.user = jwt.verify(ctx.headers.authorization, secret);  // 解密payload，获取存入的user信息
            await next();
        } catch (err) {
            if(ctx.headers.authorization){
                resJson(ctx,-1,"会话过期,请重新登录");
            }else{
                resJson(ctx,0,"请先登录！");
            }
        }
    }
});

PostRouter.post("/test", (ctx) => {
    console.log("进入！！！！！！");
    var a = sendEmail("1071296726@qq.com");
    console.log("aaa=====",a);
});

// 登录 post
PostRouter.post("/login",web.apiLogin);
// 注册 post
PostRouter.post("/register",web.apiRegister);
//回复
PostRouter.post("/replay",web.replay);
//验证码
PostRouter.post("/vercode",web.vercode);

// get 路由
exports.GetRouter = router;
// post 路由
exports.PostRouter = PostRouter;