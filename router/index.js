const router = require("koa-router")();
const web = require("../controller/web");

router.get("/",web.index);
router.get("/test",web.test);

module.exports = router;