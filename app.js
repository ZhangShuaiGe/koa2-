const koa = require("koa");
const app = new koa();
// 配置绝对路径
require('best-require')(process.cwd());

const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const {GetRouter,PostRouter} = require("./router/index");
const {articleRouter} = require("./router/article.js");
const userRouter = require("./router/user.js");
const admin = require("./router/admin");
const setting = require("./config/setting");
// const https = require("https");
const server = require('http').createServer(app.callback());

const io = require('socket.io')(server);

const chat = io.of("/chat").on('connection', function (socket) {

    socket.emit('server',"欢迎进入房间1");

    socket.on('client', function (from, msg , fn) {
        chat.emit('client',from);
    });


});

const news = io.of("/news").on('connection', function (socket) {

    socket.emit('server',"欢迎来到房间2");

    socket.on('client', function (from, msg) {
        news.emit('client',from);
    });


});




// const fs = require("fs");
// const koaBody = require("koa-body");

// redisClient.set("test","AAA",function (err,response) {
//     if(err){
//         console.log(err);
//     }else{
//         console.log(222222222222222,response);
//         redisClient.get("test",function (err,res) {
//             console.log(3333333333,res);
//             redisClient.end();
//         })
//     }
// });

// redisClient.hset('filed005', '007', 'woshi777', function (err, res) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('res:', res);
//         redisClient.hget('filed005', '007', function (err, getRslt) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log('getRslt:', getRslt);
//                 redisClient.end();
//             }
//         });
//     }
// });

// var qe = {a: 1, b:2, c:1};
// redisClient.hmset('field003', qe, function(err, response) {
//     console.log("err:", err);
//     console.log("response:", response);
//     redisClient.hmget('field003', ['a'], function (err, res) {
//         console.log(err);
//         console.log(333333333,res);
//         redisClient.end();
//     });
// });

// redisClient.hkeys("field003", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     redisClient.quit();
// });

// redisClient.hget('filed005', '006', function (err, getRslt) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('============', getRslt);
//         redisClient.end();
//     }
// });

// var vals = [];
// for (var score = 0; score < 4; score++) {
//     for (var val = 10; val < 14; val++) {
//         vals.push(score);
//         vals.push(val);
//     }
// }
// console.log("vals=======",vals);
//
// redisClient.zadd('004', vals, function(err, res) {
//     console.log(err);
//     console.log(res);
//     redisClient.zrange('004', 0, -1, function(err, resp) {
//         console.log(err);
//         console.log('range result:', resp);
//         redisClient.zcount('004', -Infinity, Infinity, function(err, respo) {
//             console.log(err);
//             console.log("len:", respo);
//             redisClient.end();
//         });
//     });
// });



// https 配置
// const httpsOption = {
//     key : fs.readFileSync("./https/1537060945371.key"),
//     cert: fs.readFileSync("./https/1537060945371.pem")
// };

// app.use(koaBody({ multipart: true }));

// post参数 body配置
app.use(bodyParser());

// cookie 加密
app.keys = ["zhangshuai"];

//redis 使用
setting.redis();

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
//文章路由
app.use(articleRouter.routes(), articleRouter.allowedMethods());
//用户路由
app.use(userRouter.routes(), userRouter.allowedMethods());


// 后台路由
app.use(admin.routes(), admin.allowedMethods());

// 报错处理
app.on('error', err => {
    error_logger.error(err);
    console.log("报错：",err);
});



//开发 http
server.listen(3000,function (err) {
    if(err){
        error_logger.error(err);
    }
    info_logger.info("node 开发已启动,3000");
});

//生产 http 强制跳转 https
// http.createServer((req,res) => {
//     res.writeHead(301,{
//         'Location':'https://www.zhangshuaige.top'
//     });
//     res.end();
// }).listen(3000,function (err) {
//     if (err) {
//         error_logger.error(err);
//     }
//     info_logger.info("node已启动,监听80端口");
// });

//生产 https
// https.createServer(httpsOption, app.callback()).listen(443,function (err) {
//     if(err){
//         error_logger.error(err);
//     }
//     info_logger.info("node https已启动,监听443端口");
// });
