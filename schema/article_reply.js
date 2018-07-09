module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article_reply', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field:"id"
        },
        articleId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            comment:'对应文章id',
        },
        nikename: {
            type: DataTypes.STRING,
            allowNull: false,
            comment:'昵称',
        },
        time:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment:'时间',
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
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            comment:'邮箱',
        },
        like:{
            type: DataTypes.STRING,
            defaultValue: 0,
            comment:'点赞数',
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