var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article_content', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field:"id",
            comment:'文章ID',
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            field:"title",
            comment:'文章标题',
            validate:{
                notEmpty: {
                    msg: '文章标题不能为空'
                },
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            field:"content",
            comment:'文章内容',
            validate:{
                notEmpty: {
                    msg: '文章内容不能为空'
                },
            }
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            comment:'文章分类',
            notEmpty: {
                msg: '文章分类不能为空'
            },
        },
        //发布时间
        time:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment:'时间',
            get() {
                return moment(this.getDataValue('time')).format('YYYY-MM-DD HH:mm:ss');
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
    },
    {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true,
    })

};