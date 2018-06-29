const router = require("koa-router")();
const admin = require("../controller/admin");

router.prefix('/admin');

// vue页面渲染
router.get("*",function (ctx) {
    if(ctx.session.adminToken){
        ctx.render("admin/index");
    }else{
        ctx.redirect("/admin/login");
    }
});

//后台登录
router.post("/login",admin.login);

// 发表文章
router.post("/article",admin.article);

//文章列表管理
router.post("/articleList",admin.articleList);

// 编辑文章
router.post("/compileArticle",admin.compileArticle);

// 删除文章
router.post("/deleteArticle",admin.deleteArticle);

// 更新文章
router.post("/updateArticle",admin.updateArticle);

module.exports = router;