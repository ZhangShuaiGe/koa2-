// 验证码
const captchapng = require("captchapng");
// md5 模块
const crypto = require('crypto');
// 时间格式化
const dateFormat = require('dateformat');
//文件上传
const multer = require('koa-multer');
//发送邮件
const nodemailer = require('nodemailer');
//七牛
const qiniu = require("qiniu");

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
    if (format) {
        return dateFormat(nowdate,format);
    } else {
        return dateFormat(nowdate, "yyyy-mm-dd HH:MM:ss");
    }
};

// 文件上传
exports.upload = () => {
    //配置
    var storage = multer.diskStorage({
        //文件保存路径
        destination: function (req, file, cb) {
            cb(null, 'static/blogUploads/');
        },
        //修改文件名称
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    });
    //加载配置
    return multer({ storage: storage });

};

//七牛上传 spaceName:空间名  fileName: 文件名  xxx.jpg
exports.qiniu = async (spaceName,fileName) => {

    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z1;
    // 是否使用https域名
    config.useHttpsDomain = true;
    // 上传是否使用cdn加速
    //config.useCdnDomain = true;

    //需要填写你的 Access Key 和 Secret Key
    var accessKey = 'td9RbKLbIWGhColG3johXIHrFnGtlAq-ApTZh74s';
    var secretKey = '-rHSlqKLhjz0CxMt2B3JgnE3NkPjBvvpTJOtZdoJ';
    var options = {
        scope: spaceName, //空间名
    };
    //要上传的文件（在服务器中的位置）
    var localFile = "./static/blogUploads/" + fileName;
    // 上传的文件名  带文件类型 xxx.jpg
    var key = fileName;

    var putPolicy = new qiniu.rs.PutPolicy(options);
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var uploadToken=putPolicy.uploadToken(mac);
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();

    // 文件上传
    var result = await new Promise(function (resolve, reject) {

        formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
            if (respErr) {
                throw respErr;
                reject(false);
            }
            if (respInfo.statusCode == 200) {
                // console.log(respBody);
                resolve(respBody);
            } else {
                // console.log(respInfo.statusCode);
                // console.log(respBody);
                reject(false);
            }
        });

    }).then( (data) => {
        return data;
    }).catch( err => {
        return err;
    });

    return result;
};

//发送邮件
exports.sendEmail = (email) => {
    // 6位随机数
    function jsrandom () {
        // 0-9的随机数
        let arr = [];//容器
        for(let i =0;i<6;i++){//循环六次
            let num = Math.random()*9;//Math.random();每次生成(0-1)之间的数;
            num = parseInt(num,10);
            arr.push(num);
        }
        return arr.join("");
    };
    let code = jsrandom();
    // 创建一个SMTP客户端配置
    const transporter = nodemailer.createTransport({
        service: 'qq',
        port: 465, // SMTP 端口
        secureConnection: false, // use SSL
        auth: {
            "user": '1071296726@qq.com', // 邮箱账号
            "pass": 'davtyqmzociibeih'  // 其他邮箱为授权码，在阿里云是SMTP密码，需要设置一下
        }
    });

    var mailOptions = {
        from :"渣渣帅的博客<1071296726@qq.com>", //发信邮箱
        to : email, //接收者邮箱
        subject: "邮箱验证码", //邮件主题
        html : `<h1>验证码为:${code}</h1>`
    };

    // 发送邮件
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return false;
            console.log(error)
        } else {
            return code;
        }
    });

};
