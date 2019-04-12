const {resJson,qiniu,deleteUpload,qiniuDelete,qiniuList} = require("./utils");
const fs = require("fs");
const util = require('util');
const Sequelize = require("../config/dbConfig");


// 发布文章
exports.article = async (ctx)=> {
    console.log(ctx.request.body);
    await ArticleModel.create(ctx.request.body).then( data => {
        resJson(ctx,1);
    }).catch( err => {
        console.log(err);
        resJson(ctx,0,err,"sql");
    });
};

//图片上传
exports.upload = async (ctx) => {
    var result = await qiniu("bokeimg",ctx.req.file.filename);

    // 上传七牛后删除本地资源
    if(result){
        var val = await deleteUpload("/blogUploads/" + ctx.req.file.filename);
        if(val){
            result.url = "http://img.zhangshuaige.top/" + result.key;
            resJson(ctx,1,result);
        } else {
            resJson(ctx,0,"本地删除失败！");
        }
    }else{
        resJson(ctx,0,"七牛上传失败！");
    }

};

//删除图片
exports.remove = async (ctx) => {
    var resutl = qiniuDelete(ctx.request.body.filename);
    if(resutl){
        resJson(ctx,1);
    }else{
        resJson(ctx,0);
    }
};

exports.qiniuImgList = async (ctx) => {
    var result = await qiniuList(ctx.request.body);
    if(result.code == 1){
        resJson(ctx,1,result);
    }else{
        resJson(ctx,0,result);
    }
};

// 文章列表管理
exports.articleList = async (ctx) => {
    // 当前页
    let currpage = Number(ctx.request.body.page) - 1;
    let pageSize = Number(ctx.request.body.pageSize);
    await ArticleModel.findAndCountAll({
        limit: pageSize || 15,
        include: [{
            model: ArticleTypeModel,
            attributes:["type"]
        }],
        offset: currpage * 15 || 0, //跳过的数据数量
        order:[['ID','DESC']],
    }).then( data => {
        resJson(ctx,1,{
            "list": data.rows, //总数据
            "pages":{
                "currpage": currpage + 1, //当前页
                "count":data.count, //总数量
                "pageSize": pageSize || 15,
            },
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
    let {id} = ctx.request.body;

    await ArticleModel.update(ctx.request.body,{
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

//查询文章类型
exports.articleType = async (ctx) => {
    let {type,sort} = ctx.request.body;
    if(type){
        // 有参数，添加分类
        await ArticleTypeModel.findOrCreate({
            where:{
                "type": type,
                "sort": sort,
            },
            defaults:{
                "type": type,
                "sort": sort,
            }
        })
        .spread((type, created) => {
            if(created){
                resJson(ctx,1,{resultMsg:"添加成功！"});
            }else{
                resJson(ctx,0,"分类已存在！");
            }
        });
    }else{
        // 没有参数查询分类
        await ArticleTypeModel.findAll().then(data => {
            resJson(ctx,1,data);
        })
    }
};

//编辑文章类型
exports.articleCompile = async (ctx) => {
    let {id,type,sort} = ctx.request.body;
    await ArticleTypeModel.update({
        "type":type,
        "sort":sort,
    },
    {
      where:{
        "id":id
      }
    }).then(data => {
        resJson(ctx,1);
    });
};

//文章类型删除
exports.articleDelete = async (ctx) => {
    let {id} = ctx.request.body;
    await ArticleTypeModel.destroy({
        where:{
            "id":id
        },
    }).then(data => {
        resJson(ctx,1);
    });
};

//友情链接查询
exports.blogroll = async (ctx) => {
    let {name,url,blogId,isRemove,isCompile} = ctx.request.body;
    if (isCompile) {
        //编辑 友链
        await WebBlogroll.update({
            "blogName": name,
            "blogUrl": url
        },
        {
            where: {
                "id": blogId
            }
        }).then ( data => {
            resJson(ctx,1,"修改成功！");
        });

    } else if (isRemove) {
        //删除友链
        await WebBlogroll.destroy({
            where:{
                "id":blogId
            },
        }).then(data => {
            resJson(ctx,1,"删除成功！");
        });
    } else if (name && url) {
        // 添加友链
        await WebBlogroll.findOrCreate({
            where:{
                "blogName": name,
                "blogUrl": url
            },
            defaults:{
                "blogName": name,
                "blogUrl": url
            }
        }).spread((user, created) => {
            if(created){
                resJson(ctx,1,"添加成功！");
            }else{
                resJson(ctx,0,"此友链已存在");
            }
        })
    } else {
        //查询友链
        let currpage = ctx.request.body.currpage || 0;
        await WebBlogroll.findAndCountAll({
            limit:15,
            offset: currpage * 15 || 0, //跳过的数据数量
            order:[['ID','DESC']],
        }).then( res => {
            resJson(ctx,1,res);
        })
    }
};

//工具类链接查询
exports.tool = async (ctx) => {
    let {name, url, toolId, isRemove, isCompile} = ctx.request.body;
    if (isCompile) {
        //编辑 友链
        await WebTool.update({
            "toolName": name,
            "toolUrl": url
        },
        {
            where: {
                "id": toolId
            }
        }).then(data => {
            resJson(ctx, 1, "修改成功！");
        });

    } else if (isRemove) {
        //删除友链
        await WebTool.destroy({
            where: {
                "id": toolId
            },
        }).then(data => {
            resJson(ctx, 1, "删除成功！");
        });
    } else if (name && url) {
        // 添加友链
        await WebTool.findOrCreate({
            where: {
                "toolName": name,
                "toolUrl": url
            },
            defaults: {
                "toolName": name,
                "toolUrl": url
            }
        }).spread((user, created) => {
            if (created) {
                resJson(ctx, 1, "添加成功！");
            } else {
                resJson(ctx, 0, "此工具库已存在");
            }
        })
    } else {
        //查询友链
        let currpage = ctx.request.body.currpage || 0;
        await WebTool.findAndCountAll({
            limit: 15,
            offset: currpage * 15 || 0, //跳过的数据数量
            order: [['ID', 'DESC']],
        }).then(res => {
            resJson(ctx, 1, res);
        })
    }
};

