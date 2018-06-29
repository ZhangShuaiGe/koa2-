const router = require("koa-router")();
const web = require("../controller/web");
const admin = require("../controller/admin");

// 首页
router.get("/",web.index);
// 文章详情
router.get("/articleDetail",web.articleDetail);
// 登录
router.all("/login",web.login);
// 注册
router.all("/register",web.register);
//回复
router.post("/replay",web.replay);
// 退出登录
router.get("/loginOut",web.loginOut);

module.exports = router;