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
            comment:"邮箱",
            validate:{
                isEmail: {
                    msg: "请输入正确的邮箱！"
                },
                notEmpty: {
                    msg: '邮箱！'
                },
            }
        }
    },{
        freezeTableName: true,
        comment:'前台 用户登录表',
    })
};