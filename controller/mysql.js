const mysql  = require('mysql');
const pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    port     : 3307,
    password : '12345678',
    database : 'web'
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
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
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
exports.register = function (val) {
    let sql = "insert into user(USERNAME,PASSWORD) values(?,?);";
    return query(sql,val);
};