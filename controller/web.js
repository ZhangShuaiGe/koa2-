const connection = require("./mysql");
exports.index = (ctx) => {
    ctx.render("index");
};

exports.login = (ctx) => {
    ctx.render("user/login");
};

exports.register = async (ctx) => {
    console.log(111111);
    var xhr = ctx.get("x-requested-with");
    if(xhr){
        var a = 100;
        await setTimeout(function () {
            a = 1000;
        },3000);
        console.log(a);
        // console.log(ctx.request.body);
        // // post请求
        // var sql = "insert into user(USERNAME,PASSWORD) values(?,?);";
        // var data = [ctx.request.body.username,ctx.request.body.password];
        // console.log(2222222222);
        // let result = await connection.query(sql,data,function (err,results,fields) {
        //     if(err){
        //         console.log("sql报错：" + err);
        //     }
        //     if(results){
        //         console.log(33333333);
        //         return 123123;
        //         // console.log(ctx);
        //         // ctx.body = {
        //         //     a:"我的天121212",
        //         //     b:123
        //         // }
        //         // return ctx.request.body = {
        //         //    code:1
        //         // };
        //         // console.log("成功");
        //         // res.redirect("/login");
        //     }
        // });
        //
        // console.log(444444444);
        // console.log(result);
        // console.log(ctx.body);
        // console.log(1111111111);
        // ctx.body = {
        //     a:"我的天121212",
        //     b:123
        // }
    }else{
        // get请求
        ctx.render("user/register");
    }
};

exports.test = async (ctx) => {
    console.log("进入");
    ctx.body = {
        a:123,
        b:123
    }
};