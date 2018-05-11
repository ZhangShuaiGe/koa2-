/*
 * @author : by Ghost
 * @date : 2017/5/26.
 * @description : 将时间毫秒格式化
 * @param {object} 参数名.
 * @return {text} 返回值.
 */
exports.format = function (time, format) {
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? "0" : "") + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case "yyyy":
                return tf(t.getFullYear());
                break;
            case "MM":
                return tf(t.getMonth() + 1);
                break;
            case "mm":
                return tf(t.getMinutes());
                break;
            case "dd":
                return tf(t.getDate());
                break;
            case "HH":
                return tf(t.getHours());
                break;
            case "ss":
                return tf(t.getSeconds());
                break;
        }
    });
};