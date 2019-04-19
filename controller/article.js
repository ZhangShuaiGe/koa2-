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
    if (ctx.get("X-Requested-With")){

        let {id} = ctx.request.body;
        let data = await articleModel.articleDetail(id);
        if(data.name == "SequelizeDatabaseError"){
            resJson(ctx,0,"文章列表查询出错！");
            return ;
        }
        resJson(ctx,1,data);

    } else {

        let id = ctx.query.id;
        let currentPage = ctx.query.page || 1;

        // 文章详情数据
        let articleDetail = articleModel.articleDetail(id);

        // 回复数据
        let reply = articleModel.articleReply({
            id:id,
            currentPage:currentPage
        });

        await Promise.all([articleDetail,reply]).then( val => {
            ctx.render("article/detail",{
                "data":val[0],
                "count":val[1].count,
                "replay":val[1].rows
            });
        }).catch( err => {
            error_logger.error("文章详情get请求报错：" + err);
        });
    }

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