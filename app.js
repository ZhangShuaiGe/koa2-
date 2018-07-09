const koa = require("koa");
const app = new koa();
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const index = require("./router/index");
const admin = require("./router/admin");
const setting = require("./config/setting");

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
app.use(index.routes(), index.allowedMethods());
// 后台路由
app.use(admin.routes(), admin.allowedMethods());

// 报错处理
app.on('error', err => {
    error_logger.error(err);
    console.log("报错：",err);
});

app.listen(3000);
console.log("服务启动=======127.0.0.1:3000");
info_logger.info("服务启动----监听3000端口");