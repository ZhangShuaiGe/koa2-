const router = require("koa-router")();
const user = require("~/controller/user");

router.post("/githubLogin",user.gethubLogin);

router.get("/githubLogin",user.showGethubLogin);

module.exports = router;