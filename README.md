2019-01-11
更新了 article_content type字段类型, 需要将 type 字段的文字 改为 article_type表对应类型的id值
更新sql: update article_content as a inner join article_type as b on a.type = b.type set a.type = b.id;
