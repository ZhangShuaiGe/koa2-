const jwt = require('jsonwebtoken'); //生成token
const secret = 'jwtlihailewodege'; //加密规则

/**
 * jwt token 创建 存储
 * @param {user_uuid:"",nikename:""}
 * @returns token
 */
exports.jwtToken = (...params) => {
    let {user_uuid,nikename} = params[0];
    // 创建token
    let token = jwt.sign({
        user_uuid: user_uuid,
        nikename:nikename,
    }, secret ,{ expiresIn: 3 * 60 * 60 });

    redisClient.set(user_uuid,token,function (err,res) {
        if(err){
            error_logger.error(err);
        } else {
            info_logger.info({"user_uuid":user_uuid,"token":token},"token已存入");
        }
    });
    redisClient.expire(user_uuid, 3 * 60 * 60); //过期时间3小时
    return token;
};