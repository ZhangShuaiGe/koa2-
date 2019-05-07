const articleModel = require("~/model/article");
const {resJson} = require("~/controller/utils");

/**
 * @name 文章列表
 */
exports.articleList = async (ctx) => {
    let currentPage,
        pageSize,
        serch,
        type;

    if(Object.keys(ctx.request.body).length > 0){
        currentPage = ctx.request.body.page || 1;
        pageSize = ctx.request.body.pageSize || 15;
        serch = ctx.request.body.serch;
        type = ctx.request.body.type;
    }else{
        currentPage = ctx.query.page || 1;
        pageSize = ctx.query.pageSize || 15;
        serch = ctx.query.serch;
        type = ctx.query.type;
    }

    let data = await articleModel.articleList({
        currentPage:currentPage,
        pageSize:pageSize,
        serch:serch,
        type:type,
    });

    if(data.name == "SequelizeDatabaseError"){
        resJson(ctx,0,"文章列表查询出错！");
        return ;
    }
    if(ctx.get("X-Requested-With")){
        resJson(ctx,1,data);
    } else {
        ctx.render("home/index",{
            "data":data.rows,
            "count": data.count,
            "type":ctx.query.type
        });
    }
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
            articleUuid:id,
            currentPage:currentPage
        });

        await Promise.all([articleDetail,reply]).then( val => {
            ctx.render("article/detail",{
                "data":val[0],
                "count":val[1].count,
                "replay":val[1].rows
            });
        }).catch( err => {
            console.log("报错了：" + err);
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

/**
 *
 * @name 删除留言
 * @returns {Promise.<void>}
 */
exports.articleReplyDelete = async (ctx) => {
    let {id} = ctx.request.body;
    let data = await articleModel.articleReplyDelete(id);
};