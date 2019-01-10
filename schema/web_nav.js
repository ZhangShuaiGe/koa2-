var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('web_nav', {

                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                    comment: '菜单id',
                },
                navCon:{
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '菜单内容',
                    validate: {
                        notEmpty: {
                            msg: '菜单内容'
                        },
                    }
                },
            },
            {
                freezeTableName: true, //不修改表名
                timestamps: false, //不添加时间戳属性 (updatedAt, createdAt)
            })
};