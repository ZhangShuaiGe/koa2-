const sequelize = require("../config/dbConfig");
const Op = sequelize.Op;

/**
 * @name  文章列表
 * @param currentPage
 * @param pageSize
 * @param serch 搜索条件
 * @param type 文章类型
 */
exports.articleList = (...params) => {
    let currentPage = params[0].currentPage ? params[0].currentPage : 1;
    let pageSize = params[0].pageSize ? params[0].pageSize : 15;
    let serch = params[0].serch;
    let type = params[0].type;
    // 动态查询条件
    function where(serch,type) {
        if(type){
            //如果有文章类型
            return {type: type};
        }else if(serch){
            //如果有 搜索参数
            return {
                [Op.or]:[
                    {
                        title:{
                            [Op.like]: `%${serch}%`,
                        }
                    },
                    {
                        content:{
                            [Op.like]: `%${serch}%`,
                        }
                    }
                ],

            }
        }
        else {
            return {};
        }
    }
    return ArticleModel.findAndCountAll({
        attributes: { exclude: ['content','markdownContent'] },
        limit: pageSize,
        order:[['istop','DESC'],['ID','DESC']],
        include: [{
            model: ArticleTypeModel,
            attributes:["type","id"]
        }],
        where:where(serch,type),
        offset: (currentPage - 1) * pageSize, //跳过的数据数量
    }).then( data => {
        return data;
    }).catch( err => {
        error_logger.error("文章列表sql报错：" + err);
        return err;
    });
};

/**
 * @name 文章详情
 * @param id 文章id
 * @returns {Promise.<T>}
 */
exports.articleDetail = (id) => {
    return ArticleModel.findOne({
        include: [{
            model: ArticleTypeModel,
            attributes:["type","id"]
        }],
        where:{id:id}
    }).then( data => {
        return data;
    }).catch( err => {
        error_logger.error("文章详情sql报错：" + err);
        return err;
    });
};

/**
 * @name 文章回复
 * @param id 文章id
 * @returns {Promise.<T>}
 */
exports.articleReply = (...params) => {
    let id = params[0].id;
    let pageSize = params[0].pageSize || 15;
    let currentPage = params[0].currentPage || 1;
    return ArticleReplyModel.findAndCountAll({
        where:{
            articleId: id
        },
        limit: pageSize,
        offset: (currentPage - 1) * 15 || 0, //跳过的数据数量
        order:[['ID','DESC']],
    }).then( data => {
        return data;
    }).catch(err => {
        error_logger.error("留言查询报错：" + err);
    });
};


