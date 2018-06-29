const mysql  = require('mysql');
const pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    port     : 3307,
    password : '12345678',
    database : 'web',
    timezone : 'yyyy-MM-dd hh:mm:ss'
});

// pool.connect(function (err) {
//     if (err) {
//         global.info_logger.info("mysql 连接失败：" + err.stack);
//         return;
//     }
//     global.info_logger.info("mysql 连接成功");
// });

const query = ( sql, values ) => {

    return new Promise(( resolve, reject ) => {
        pool.getConnection( (err, connection) => {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, (err,results,fields) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( results )
                    }
                    connection.release();
                })
            }
        })
    })

};

// const query = (sql,data) => {
//     return new Promise(resolve,reject) => {
//         pool.getConnection((err,connection)=>{
//             connection.query(sql,data,function (err,results,fields) {
//                 if(err){
//                     console.log("sql报错：" + err);
//                     reject(err);
//                 }
//                 if(results){
//                     resolve(results);
//                 }
//                 connection.release();
//             });
//         })
//     }
// };

// 注册
exports.register = (val) => {
    let sql = "insert into USER(EMAIL,USERNAME,PASSWORD) values(?,?,?);";
    return query(sql,val);
};

//注册查询登录名（邮箱）是否存在
exports.queryUserName = (val) => {
    let sql = `SELECT * FROM USER WHERE EMAIL = "${val}";`;
    return query(sql);
};

// 登录
exports.login = (val) => {
    let sql = `SELECT * FROM USER WHERE EMAIL = ? and PASSWORD = ?`;
    return query(sql,val);
};

// 文章
exports.article = (val)=> {
    let sql = `insert into ARTICLE_CONTENT(TITLE,CONTENT,DATE,TYPE,KEYWORD) values(?,?,?,?,?)`;
    return query(sql,val);
};

//文章列表
exports.articleList = (val) => {
    let sql;
    // 如果有类型 html css js
    if (val.type) {
        sql = `SELECT ID,TITLE,DATE,TYPE FROM ARTICLE_CONTENT where type = '${val.type}' ORDER BY ID DESC LIMIT ${val.page*15},${15}`;
    } else {
        sql = `SELECT ID,TITLE,DATE,TYPE FROM ARTICLE_CONTENT ORDER BY ID DESC LIMIT ${val.page*15},${15}`;
    }
    return query(sql);
};

// 获取总页数（通用，不针对某张表）
exports.pageCount = (val) => {
    let sql;
    if(val.condition){
        // 有where条件查询
        sql = `SELECT count(*) count from ${val.from} where type='${val.condition}'`;
    }else{
        sql = `SELECT count(*) count from ${val.from}`;
    }
    return query(sql);
};

// 文章详情
exports.articleDetail = (val) => {
    let sql = `SELECT * FROM ARTICLE_CONTENT WHERE ID = ${val};`;
    return query(sql);
};

// 删除文章
exports.deleteArticle = (val) => {
    let sql = `delete FROM ARTICLE_CONTENT WHERE ID = ${val};`;
    return query(sql);
};

//更新文章
exports.updateArticle = (val) => {
    let sql = `update ARTICLE_CONTENT set TITLE = '${val.title}',CONTENT = '${val.content}', DATE= '${val.date}',TYPE = '${val.type}' WHERE ID = ${val.id};`;
    return query(sql);
};

// 提交留言
exports.replay = (val) => {
    let sql = `INSERT INTO ARTICLE_REPLY(ID,REPLY_CON,EMAIL,TIME,NIKENAME) values (?,?,?,?,?)`;
    return query(sql,val);
};

// 查询留言
exports.queryreplay = (val) => {

    let sql = `SELECT * FROM ARTICLE_REPLY WHERE ID = ${val} order by TIME desc`;
    return query(sql,val);
};

//查询用户昵称
exports.queryUserNickname = (val) => {
    let sql = `SELECT username FROM USER WHERE email = '${val}'`;
    return query(sql);
};

// 后台用户登录