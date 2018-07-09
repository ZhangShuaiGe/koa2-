const loggers = require("logger");
const {dateformat} = require("../controller/utils");
const session = require("koa-session");
const path = require("path");
const render = require('koa-art-template');
// mysql 配置
const sequelize = require("./dbConfig");

// 模板配置
exports.template = function (app) {
    // 模板引擎配置
    render(app, {
        root: path.join(__dirname,'../views'),
        extname: '.html',
        debug: process.env.NODE_ENV !== 'production'
    });
};

// 日志配置
exports.logger = function () {
    // 业务日志  日志类型：'fatal', 'error', 'warn', 'info', 'debug'
    global.info_logger = loggers.createLogger("logs/info/log_" + dateformat(Date.now(),"yyyy-mm-dd") + ".log");
    info_logger.format = function (level, date, message) {
        return "[" + level + "]" + ":" + dateformat(new Date()) + message;
    };
    // 报错日志
    global.error_logger = loggers.createLogger("logs/error/log_" + dateformat(Date.now(),"yyyy-mm-dd") + ".log");
    error_logger.format = function (level, date, message) {
        return "[" + level + "]" + ":" + dateformat(new Date()) + message;
    };
};

// session 配置
exports.session = function (app) {
    const CONFIG = {
        key: 'zhangshuai', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 60*60*1000,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    };
    app.use(session(CONFIG, app));
};

// sql 全局配置
exports.mysql = async function () {
    // 文章表，全局配置，全局随时可以调用
    //文章表
    global.ArticleModel = sequelize.import('../schema/article_content');
    // 文章回复表
    global.ArticleReplyModel = sequelize.import('../schema/article_reply');
    //web用户表
    global.WebUserModel = sequelize.import('../schema/web_user');
    // 文章和回复表 关联
    ArticleModel.hasMany(ArticleReplyModel, {foreignKey: 'articleId', targetKey: 'id', as:"replay"});
};
