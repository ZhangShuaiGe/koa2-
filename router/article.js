const router = require("koa-router")();
const article = require("~/controller/article");

router.post("/articleList", article.articleList);

exports.articleRouter = router;