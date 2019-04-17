const articleModel = require("~/model/article");
const {resJson} = require("~/controller/utils");

exports.articleList = async (ctx) => {
    let currentPage = Number(ctx.request.body.page) || 1;
    let pageSize = Number(ctx.request.body.pageSize) || 15;
    let list = await articleModel.articleList(currentPage,pageSize);
    if(list.name == "SequelizeDatabaseError"){
        resJson(ctx,0,"文章列表查询出错！");
        return ;
    }
    resJson(ctx,1,list);
};