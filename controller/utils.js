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
//fs模块
const fs = require("fs");

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

// 文件上传到本地
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

//删除本地文件
exports.deleteUpload = async (url) => {
    return await new Promise(function (resolve, reject) {
        fs.unlink("static" + url, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    }).then( data => {
        return true;
    }).catch( err => {
        return false;
    });
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

//七牛图片 删除
exports.qiniuDelete = async (fileName) => {

    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z1;
    // 是否使用https域名
    config.useHttpsDomain = true;

    var accessKey = 'td9RbKLbIWGhColG3johXIHrFnGtlAq-ApTZh74s';
    var secretKey = '-rHSlqKLhjz0CxMt2B3JgnE3NkPjBvvpTJOtZdoJ';
    var bucket = "bokeimg"; //空间名
    var key = fileName;  //文件名

    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var bucketManager = new qiniu.rs.BucketManager(mac, config);

    // 单张删除
    var deleteOperations = [
        qiniu.rs.deleteOp(bucket, key),
    ];

    //多张删除
    // var deleteOperations = [
    //     qiniu.rs.deleteOp(bucket, 'qiniu1.mp4'),
    //     qiniu.rs.deleteOp(bucket, 'qiniu2.mp4'),
    //     qiniu.rs.deleteOp(bucket, 'qiniu3.mp4'),
    //     qiniu.rs.deleteOp(bucket, 'qiniu4x.mp4'),
    // ];
    return await new Promise((resolve, reject)=>{
        bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
            if (err) {
                console.log("报错：",err);
                //throw err;
            } else {
                // 200 is success, 298 is part success
                if (parseInt(respInfo.statusCode / 100) == 2) {
                    respBody.forEach(function(item) {
                        if (item.code == 200) {
                            console.log("成功！");
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    });
                } else {
                    reject(false);
                    console.log(respInfo.deleteusCode);
                    console.log(respBody);
                }
            }
        });
    }).then(res => {
        return res;
    }).catch(err => {
        return err;
    });
};

//七牛文件列表
exports.qiniuList = async (config = {}) => {
    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z1;
    // 是否使用https域名
    config.useHttpsDomain = true;

    var accessKey = 'td9RbKLbIWGhColG3johXIHrFnGtlAq-ApTZh74s';
    var secretKey = '-rHSlqKLhjz0CxMt2B3JgnE3NkPjBvvpTJOtZdoJ';
    var bucket = "bokeimg"; //空间名

    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z0;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);

    // @param options 列举操作的可选参数
    //prefix    列举的文件前缀
    //marker    上一次列举返回的位置标记，作为本次列举的起点信息
    //limit     每次返回的最大列举文件数量
    //delimiter 指定目录分隔符
    var options = {
        limit: config.limit || 10,
        prefix: config.prefix || "",
        marker: config.marker || "",
    };
    return new Promise(function (resolve,reject) {
        bucketManager.listPrefix(bucket, options, function(err, respBody, respInfo) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (respInfo.statusCode == 200) {
                //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
                //指定options里面的marker为这个值
                var nextMarker = respBody.marker;
                var commonPrefixes = respBody.commonPrefixes;
                var items = respBody.items;
                // console.log("==========>>",items);
                resolve({
                    "nextMarker": nextMarker,
                    "commonPrefixes": commonPrefixes,
                    "items": items,
                    "code":1,
                });
            } else {
                // console.log(respInfo.statusCode);
                // console.log(respBody);
                reject({
                    "code":0,
                    "respInfo":respInfo.statusCode,
                    "respBody":respBody,
                });
            }
        });
    }).then( res => {
        return res;
    }).catch( err => {
        return err;
    });

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
