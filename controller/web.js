const mysql = require("./mysql");
exports.index = (ctx) => {
    ctx.render("index");
};

exports.login = (ctx) => {
    ctx.render("user/login");
};

exports.register = async (ctx) => {
    if(ctx.method == "POST"){
        console.log(111111111);
        var a = mysql.register([ctx.request.body.username,ctx.request.body.password]);
        a.then(function (data) {
            console.log(data);
        });
    } else {
        // get请求
        ctx.render("user/register");
    }
};
