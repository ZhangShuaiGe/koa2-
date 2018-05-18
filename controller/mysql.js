var mysql  = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    port     : 3307,
    password : '12345678',
    database : 'web'
});

connection.connect(function (err) {
    if (err) {
        global.info_logger.info("mysql 连接失败：" + err.stack);
        return;
    }
    global.info_logger.info("mysql 连接成功");
});

module.exports = connection;