/**
 * @name  文章列表
 * @param currentPage
 * @param pageSize
 * @param serch 搜索条件
 * @param type 文章类型
 * @returns {Promise.<T>}
 */
exports.articleList = (currentPage,pageSize,serch,type) => {
    !currentPage ? currentPage = 1 : "";
    !pageSize ? pageSize = 15 : "";
    return ArticleModel.findAndCountAll({
        limit: pageSize,
        include: [{
            model: ArticleTypeModel,
            attributes:["type"]
        }],
        offset: (currentPage - 1) * pageSize || 0, //跳过的数据数量
        order:[['ID','DESC']],
    }).then( data => {
        return data;
    }).catch( err => {
        error_logger.error("sql报错：" + err);
        return err;
    });
};

