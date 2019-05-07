v2.0 上线注意事项：

1. 批量添加 文章表 uuid 字段
执行：
第一步：添加uuid字段
ALTER TABLE article_content ADD uuid VARCHAR(34)  not Null;

第二步： 设置uuid初始值
UPDATE article_content SET uuid = (SELECT UUID());
UPDATE article_content SET uuid = REPLACE(uuid,"-","");



2. 修改 回复表结构 ， articleId 删除 新建 uuid;

添加 articleUuid 字段
ALTER TABLE article_reply ADD articleUuid VARCHAR(34)  not Null;

设置articleUuid值 = 文章的 uuid 值
update article_reply as A, article_content as B set A.articleUuid = B.uuid where A.articleId = B.id;

删除articleId
1. 删除外键，否则无法删除
2. 执行 alter table article_reply drop column articleId;



3. 新添加了2个包， yarn install