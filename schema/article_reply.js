var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article_reply', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field:"id"
        },
        articleUuid:{
            type: DataTypes.STRING(34),
            allowNull: false,
            comment:'对应文章的uuid',
        },
        reply_con:{
            type:DataTypes.TEXT,
            allowNull: false,
            comment:'回复内容',
            validate:{
                notEmpty: {
                    msg: '回复内容不能为空'
                },
            }
        },
        replay_uuid:{
            type: DataTypes.STRING(34),
            comment:'被回复人的uuid',
            defaultValue:0,
        },
        user_uuid:{
            type: DataTypes.STRING(34),
            allowNull: false,
            comment:'回复人的uuid',
        },
        parent_id:{
            type: DataTypes.STRING(255),
            comment:'回复对应留言的id',
            defaultValue:0,
        },
        replay_sum:{
            type: DataTypes.STRING(255),
            comment:'一级留言被回复总数',
            defaultValue:0,
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
        comment:'文章回复表',
    })

};