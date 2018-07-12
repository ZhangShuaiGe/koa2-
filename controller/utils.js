// 验证码
const captchapng = require("captchapng");
// md5 模块
const crypto = require('crypto');
// 时间格式化
const dateFormat = require('dateformat');

// 验证码
exports.captchapng = (ctx) => {
    let cap = parseInt(Math.random() * 9000 + 1000);
    let p = new captchapng(80, 30, cap);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    let base64 = p.getBase64();
    ctx.cookies.set('vercode', cap, {maxAge: 360000, httpOnly: true});
    return 'data:image/png;base64,' + base64;
};

// md5加密
exports.md5 = (password) => {
    let md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
};

// 返回数据格式化
exports.resJson = (ctx,code,data,sql) => {
    if(code == "1"){
       ctx.body = {
           "resultCode":1,
           "resultdata":data
       };
       return;
    }else if(code == "0"){
        // sql 报错走这里
        if(sql){
            ctx.body = {
                "resultCode":0,
                "resultMsg": data.errors[0].message
            };
            return;
        }else{
            ctx.body = {
                "resultCode":0,
                "resultMsg": data
            };
            return;
        }
    }else if(code == "-1"){
        ctx.body = {
            "resultCode":-1,
            "resultMsg": data
        };
        return;
    }
};

// 时间格式化
exports.dateformat = (nowdate,format) => {
    if(format){
        return dateFormat(nowdate,format);
    }else{
        return dateFormat(nowdate, "yyyy-mm-dd HH:MM:ss");
    }
};
