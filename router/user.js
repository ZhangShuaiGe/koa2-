const Router = require('koa-router');
const user = require("~/controller/user");

const router = new Router({
    prefix: '/user'
});

//github 登录
router.post("/githubLogin",user.gethubLogin);
//获取github用户信息
router.post("/queryGithubUser",user.queryGithubUser);
//获取注册过来的用户信息
router.post("/queryUser",user.queryUser);
//github 登录过度页
router.get("/githubLogin",user.showGethubLogin);
//聊天室
router.get("/chatroom",user.chatroom);
module.exports = router;