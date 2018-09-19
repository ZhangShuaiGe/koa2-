const koa = require("koa");
const app = new koa();
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const {GetRouter,PostRouter} = require("./router/index");
const admin = require("./router/admin");
const setting = require("./config/setting");
const https = require("https");
const http = require("http");
let fs = require("fs");

// https 配置
const httpsOption = {
    key : fs.readFileSync("./https/1537060945371.key"),
    cert: fs.readFileSync("./https/1537060945371.pem")
};

// post参数 body配置
app.use(bodyParser());

// cookie 加密
app.keys = ["zhangshuai"];

// 日志配置
setting.logger();

// session配置
setting.session(app);

// 模板配置
setting.template(app);

// sql全局
setting.mysql();

// 静态资源配置
app.use(static(__dirname + '/static'));

// 路由配置
app.use(GetRouter.routes(), GetRouter.allowedMethods());
app.use(PostRouter.routes(), PostRouter.allowedMethods());

// 后台路由
app.use(admin.routes(), admin.allowedMethods());

// 报错处理
app.on('error', err => {
    error_logger.error(err);
    console.log("报错：",err);
});

// app.listen(3500);
http.createServer(app.callback()).listen(3500,function (err) {
    if(err){
        error_logger.error(err);
    }
    info_logger.info("node已启动,监听80端口");
});

https.createServer(httpsOption, app.callback()).listen(443,function (err) {
    if(err){
        error_logger.error(err);
    }
    info_logger.info("node https已启动,监听443端口");
});
