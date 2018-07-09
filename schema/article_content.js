module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article_content', {
        // 文章ID
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field:"id"
        },
        // 文章标题
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            field:"title",
            validate:{
                notEmpty: {
                    msg: '文章标题不能为空'
                },
            }
        },
        // 文章内容
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            field:"content",
            validate:{
                notEmpty: {
                    msg: '文章内容不能为空'
                },
            }
        },
        // 文章分类
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: {
                msg: '文章分类不能为空'
            },
        },
        //发布时间
        time:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true,
    })

};