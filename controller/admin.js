const mysql = require("./mysql");
const {resJson} = require("./utils");

// 发布文章
exports.article = async (ctx)=> {
    let {title,content,date,type,keyword} = ctx.request.body.form;
    await mysql.article([title,content,date,type,keyword]).then((data)=>{
        if (data) {
            ctx.body = {
                "resultCode":1
            };
        }
    });
};

// 文章列表管理
exports.articleList = async (ctx) => {
    // 首页分页控制
    if(ctx.request.body.page){
        ctx.request.body.page = Number(ctx.request.body.page) - 1;
    }else{
        ctx.request.body.page = 0;
    }

    // 根据分页加载首页 文章列表
    let content = mysql.articleList({page:ctx.request.body.page}).then((data)=>{
        return data;
    });

    //查询总页数，分页插件要用，传的字段是(表名)
    let count = mysql.pageCount({from:"ARTICLE_CONTENT"}).then((data)=>{
        return data;
    });

    await Promise.all([content,count]).then((data)=>{
        resJson(ctx,1,{
            "list": data[0],
            "count": data[1][0].count, //总数据个数
            "currpage": Number(ctx.request.body.page) + 1 //当前pages值
        });
    }).catch((e)=>{
        resJson(ctx,0,"系统异常");
    })
};

// 删除文章
exports.deleteArticle =  async (ctx) => {
    await mysql.deleteArticle(ctx.request.body.id).then((data)=>{
        resJson(ctx,1);
    })
};

// 编辑文章
exports.compileArticle = async (ctx) => {
    await mysql.articleDetail(ctx.request.body.id).then( (data) => {
        resJson(ctx,1,data[0]);
    });
};

//更新文章
exports.updateArticle = async (ctx) => {
    console.log(ctx.request.body);
    await mysql.updateArticle(ctx.request.body.form).then((data)=>{
        resJson(ctx,1);
    })
};

// 后台登录
exports.login = async (ctx) => {
    let {username,password} = ctx.request.body;
    await mysql.login();
};

