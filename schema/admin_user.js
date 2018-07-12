//后台用户表
var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("admin_user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field:"id",
            comment:"自增id",
        },
        username: {
            type: DataTypes.STRING,
            allowNull:false,
            comment:"用户名",
            validate:{
                notEmpty: {
                    msg: '请输入用户名！'
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false,
            comment:"密码",
            validate: {
                notEmpty: {
                    msg: '请输入密码！'
                }
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            comment:'创建时间',
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            comment:'更新时间',
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    },{
        freezeTableName: true,
        comment:'后台 用户登录表',
    })
};
