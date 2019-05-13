const jwt = require('jsonwebtoken'); //生成token
const secret = 'jwtlihailewodege'; //加密规则

exports.jwtToken = (...params) => {
    // 创建token
    let token = jwt.sign({
        email: params[0].email,
        nikename:params[0].nikename,
    }, secret ,{ expiresIn: 3 * 60 * 60 });

    redisClient.set(params[0].email,token,function (err,res) {
        if(err){
            error_logger.error(err);
        } else {
            info_logger.info({"email":email,"token":token},"token已存入");
        }
    });
    redisClient.expire(email, 3 * 60 * 60); //过期时间3小时
};