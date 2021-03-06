var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('web_tool', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: "id",
            comment: 'id',
        },
        toolName: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '工具站名字',
            validate: {
                notEmpty: {
                    msg: '工具站名字不能为空'
                },
            }
        },
        toolUrl:{
            type: DataTypes.STRING,
            allowNull: false,
            field: "toolUrl",
            comment: '工具地址',
            validate: {
                notEmpty: {
                    msg: '工具地址不能为空'
                },
            }
        },
        sort: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '排序',
            defaultValue:0,
        }
    },
    {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true,
    })
};