var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("github_user", {
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
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: true,
            comment:"邮箱",
        },
        avatar_url:{
            type: DataTypes.STRING,
            comment:"头像",
        },
        github_createTime:{
            type: DataTypes.DATE,
            comment:'github账户创建时间',
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
        comment:'github用户登录表',
    })
};
