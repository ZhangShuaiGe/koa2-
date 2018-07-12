const {resJson} = require("./utils");

// 发布文章
exports.article = async (ctx)=> {
    let {title,content,date,type,keyword} = ctx.request.body.form;

    await ArticleModel.create({
        "title":title,
        "content":content,
        "time":date,
        "type":type,
    }).then( data => {
        resJson(ctx,1);
    }).catch( err => {
        console.log(err);
        resJson(ctx,0,err,"sql");
    });

};

// 文章列表管理
exports.articleList = async (ctx) => {
    // 当前页
    let currpage = Number(ctx.request.body.page) - 1;

    await ArticleModel.findAndCountAll({
        attributes:{exclude: ["content"]},
        limit:15,
        offset: currpage * 15 || 0, //跳过的数据数量
        order:[['ID','DESC']],
    }).then( data => {
        resJson(ctx,1,{
            "currpage": currpage + 1, //当前页
            "count":data.count, //总数量
            "list": data.rows, //总数据
        })
    }).catch( err => {
        console.log(err);
        resJson(ctx,0,err,"sql");
    });

};

// 删除文章
exports.deleteArticle =  async (ctx) => {
    await ArticleModel.destroy({
        where:{
            id: ctx.request.body.id
        }
    }).then( data => {
        resJson(ctx,1);
    }).catch( err => {
        resJson(ctx,0,"删除失败");
    });

};

// 根据id查询文章
exports.compileArticle = async (ctx) => {

    await ArticleModel.findById(ctx.request.body.id).then( data => {
        resJson(ctx,1,data);
    }).catch( err => {
        resJson(ctx,0,"更新失败");
    });

};

//更新文章
exports.updateArticle = async (ctx) => {
    let {id,title,content,type,time} = ctx.request.body.form;

    await ArticleModel.update({
        "title":title,
        "content":content,
        "type":type,
        "time":time,
    },{
        where:{
            "id":id
        }
    }).then( data => {
        resJson(ctx,1);
    }).catch( err => {
        error_logger.error("报错：" + err);
        info_logger.info("报错：" + err);
    });

};

// 后台登录
exports.login = async (ctx) => {
    let {username,password} = ctx.request.body;
    await AdminUserModel.findOne({
        where:{
            username: username,
            password:password
        }
    }).then( data=> {
        if(data){
            ctx.session.AdminTOKEN = username;
            resJson(ctx,1);
        }else{
            resJson(ctx,0,"用户名或密码错误！");
        }
    }).catch(err => {
        error_logger.error("报错：" + err);
        info_logger.info("报错：" + err);
    })
};

