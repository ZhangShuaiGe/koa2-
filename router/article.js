const router = require("koa-router")();
const article = require("~/controller/article");

// 文章列表
router.post("/articleList", article.articleList);
// 文章详情
router.all("/articleDetail", article.articleDetail);
//查询文章留言列表
router.post("/getArticleReplyList", article.getArticleReplyList);

exports.articleRouter = router;