const router = require("koa-router")();
const web = require("../controller/web");
// 首页
router.get("/",web.index);
// 登录
router.get("/login",web.login);
// 注册
router.all("/register",web.register);
// router.post("/register",web.test);

module.exports = router;