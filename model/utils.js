const uuidv1 = require('uuid/v1');

/**
 * 输入uuid
 */
exports.uuid = function () {
    let uuid = uuidv1().replace(/\-/g,"");
    return uuid;
};