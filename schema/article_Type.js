var moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('article_Type', {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                    field: "id",
                    comment: '分类ID',
                },
                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    field: "type",
                    comment: '文章分类',
                    validate: {
                        notEmpty: {
                            msg: '文章分类不能为空'
                        },
                    }
                },
                sort: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '排序',
                    defaultValue:999,
                }

    },
    {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true,
    })

};