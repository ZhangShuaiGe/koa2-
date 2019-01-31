// 文章详情
exports.articleDeatil =  async (id,currpage) => {
    let data = await ArticleModel.findAndCountAll({
        where:{
            id: id
        },
        // 查询关联的留言
        include: [{
            model: ArticleReplyModel,
            as: 'replay',
            order:[['ID','DESC']],
            limit:15,
            offset: currpage * 15 || 0, //跳过的数据数量
        }]
    }).then( data => {
        return data;
    }).catch( err => {
        console.log("报错:",err);
        error_logger.error(err);
    });
    return data;
};