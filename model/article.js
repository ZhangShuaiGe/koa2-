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
 * @param uiid 文章的uuid
 * @returns {Promise.<T>}
 */
exports.articleDetail = (uuid) => {
    //阅读+1
    this.articleRead(uuid);
    return ArticleModel.findOne({
        include: [{
            model: ArticleTypeModel,
            attributes:["type","id"]
        }],
        where:{uuid:uuid}
    }).then( data => {
        return data;
    }).catch( err => {
        error_logger.error("文章详情sql报错：" + err);
        return err;
    });
};

/**
 * @name 文章回复列表
 * @param articleUuid 文章id
 * @param pageSize
 * @param currentPage
 * @returns {Promise.<T>}
 */
exports.getArticleReplyList = (...params) => {
    let articleUuid = params[0].articleUuid;
    let pageSize = params[0].pageSize || 15;
    let currentPage = params[0].currentPage || 1;
    let parent_id = params[0].parent_id || 0; //默认一级回复
    function where() {
        if(articleUuid){
            return {
                [Op.and]: [
                    {articleUuid: articleUuid},
                    {parent_id: parent_id}
                ]
            };
        }else{
            return {};
        }
    }
    return ArticleReplyModel.findAndCountAll({
        where: where(),
        limit: pageSize,
        offset: (currentPage - 1) * 15 || 0, //跳过的数据数量
        order:[['ID','DESC']],
    }).then( data => {
        return data;
    }).catch(err => {
        error_logger.error("留言查询报错：" + err);
    });
};

/**
 * @name 文章阅读 +1
 * @param id
 */
exports.articleRead = (uuid) => {
    sequelize.query(`update article_content set browse = browse+1 where uuid = '${uuid}'`);
};

/**
 * @name 删除指定文章的全部留言
 * @param articleUuid
 */
exports.articleReplyDelete = (...params) => {
    let id = params[0].id;
    let articleUuid = params[0].articleUuid;
    return ArticleReplyModel.destroy({
        where:{
            [Op.or]: [
                {id:id},
                {articleUuid: articleUuid}
            ]
        },
    }).then( data => {
        return data;
    }).catch( err => {
        error_logger.error("留言删除报错：" + err);
        return err;
    })
};

/**
 * 添加回复
 * @param params
 * @returns {Promise.<T>}
 */
exports.articleReplyAdd = async (...params) => {
    let {articleUuid,
        content,
        replay_uuid,
        parent_id,
        user_userName,
        replay_userName,
        user_uuid
    } = params[0];
    //更新留言条数信息
    if(parent_id){
        sequelize.query(`update article_reply set replay_sum = replay_sum+1 where id = ${parent_id}`);
    }
    return await ArticleReplyModel.create({
        articleUuid:articleUuid,
        reply_con: content,
        user_uuid:user_uuid,
        replay_uuid:replay_uuid,
        parent_id:parent_id,
        replay_userName:replay_userName,
        user_userName:user_userName,
    }).then( data => {
        return true;
    }).catch(e =>{
        error_logger.error("留言添加报错：" + err);
        console.log("报错:" + e);
        return false;
    });
};


