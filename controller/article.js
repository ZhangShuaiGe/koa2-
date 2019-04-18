const articleModel = require("~/model/article");
const {resJson} = require("~/controller/utils");

/**
 * @name 文章列表
 */
exports.articleList = async (ctx) => {
    let currentPage = Number(ctx.request.body.page) || 1;
    let pageSize = Number(ctx.request.body.pageSize) || 15;
    let {serch,type} = ctx.query;
    let data = await articleModel.articleList({
        currentPage:currentPage,
        pageSize:pageSize,
        serch:serch,serch,
        type:serch,type
    });
    if(data.name == "SequelizeDatabaseError"){
        resJson(ctx,0,"文章列表查询出错！");
        return ;
    }
    resJson(ctx,1,data);
};

/**
 * @name 文章详情
 */
exports.articleDetail = async (ctx) =>{
    let {id} = ctx.request.body;
    let data = await articleModel.articleDetail(id);
    if(data.name == "SequelizeDatabaseError"){
        resJson(ctx,0,"文章列表查询出错！");
        return ;
    }
    resJson(ctx,1,data);
};

/**
 * @name 文章回复
 * @returns {Promise.<void>}
 */
exports.articleReply = async (ctx) => {
    let {id} = ctx.request.body;
    let data = await articleModel.articleReply({id:id});
    if(data.name == "SequelizeDatabaseError"){
        resJson(ctx,0,"留言列表查询出错！");
        return ;
    }
    resJson(ctx,1,data);
};