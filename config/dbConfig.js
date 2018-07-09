const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'mysql', //数据库类型
    host: 'localhost',
    database:"web", //数据库名
    username:"root",
    password:"12345678",
    port: 3307,
    // timezone : 'yyyy-MM-dd hh:mm:ss',
    timezone:'+08:00', //东八时区
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

sequelize
        .authenticate()
        .then(() => {
            console.log('mysql连接成功！');
            info_logger.info("mysql连接成功！");
        })
        .catch(err => {
            console.error('mysql连接失败：', err);
            info_logger.error("mysql连接成功！");
        });

// 同步所有尚未在数据库中的模型, 如果没有模型中的表，将会自动创建
sequelize.sync();
//sequelize.sync({force: true}) // 破坏性操作 这将先丢弃表，然后重新创建它，慎用，重启会导致表 清空

module.exports = sequelize;