const router = require("koa-router")();
const article = require("~/controller/article");

router.post("/articleList", article.articleList);
router.post("/articleDetail", article.articleDetail);
router.post("/articleReply", article.articleReply);

exports.articleRouter = router;