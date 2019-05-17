var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("web_user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field:"id",
            comment:"自增id",
        },
        user_uuid: {
            type: DataTypes.STRING(34),
            allowNull: false,
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
        email: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: true,
            comment:"邮箱",
            validate:{
                isEmail: {
                    msg: "请输入正确的邮箱！"
                },
                notEmpty: {
                    msg: '邮箱！'
                },
            }
        },
        avatar_url:{
            type: DataTypes.STRING,
            comment:"头像",
            defaultValue:"",
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
        comment:'前台 用户登录表',
    })
};
