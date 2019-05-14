const jwt = require('jsonwebtoken'); //生成token
const secret = 'jwtlihailewodege'; //加密规则

/**
 * jwt token 创建 存储
 * @param {email:"",nikename:""}
 * @returns token
 */
exports.jwtToken = (...params) => {
    let {email,nikename} = params[0];
    // 创建token
    let token = jwt.sign({
        email: email,
        nikename:nikename,
    }, secret ,{ expiresIn: 3 * 60 * 60 });

    redisClient.set(email,token,function (err,res) {
        if(err){
            error_logger.error(err);
        } else {
            info_logger.info({"email":email,"token":token},"token已存入");
        }
    });
    redisClient.expire(email, 3 * 60 * 60); //过期时间3小时
    return token;
};