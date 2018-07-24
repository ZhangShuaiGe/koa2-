const router = require("koa-router")();
const admin = require("../controller/admin");
const {resJson,upload} = require("../controller/utils");

router.prefix('/admin');

// 中间件校验登录信息
router.use( async (ctx,next) => {
    if(ctx.method == "POST"){
        // 登录接口不设置 token 验证
        if(ctx.url == "/admin/login"){
            await next();
        }else if(ctx.session.AdminTOKEN){
            await next();
        }else {
            await resJson(ctx,-1,"会话过期，请重新登录！");
        }
    }else{
        // 登录接口不设置 token 验证
        if(ctx.url == "/admin/login"){
            await next();
        }else if(ctx.session.AdminTOKEN){
            await next();
        } else {
            ctx.redirect("/admin/login");
        }
    }
});

// vue页面渲染
router.get("*",function (ctx) {
    ctx.render("admin/index");
});

//后台登录
router.post("/login",admin.login);

// 发表文章
router.post("/article",admin.article);

// 图片上传
router.post("/upload",upload().single('file'),admin.upload);

// 图片删除
router.post("/remove",admin.remove);

//文章列表管理
router.post("/articleList",admin.articleList);

// 编辑文章
router.post("/compileArticle",admin.compileArticle);

// 删除文章
router.post("/deleteArticle",admin.deleteArticle);

// 更新文章
router.post("/updateArticle",admin.updateArticle);

module.exports = router;