<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="文章分类管理" name="first">
                <ArticleType></ArticleType>
            </el-tab-pane>
            <el-tab-pane label="友情链接管理" name="second">
                <Blogroll></Blogroll>
            </el-tab-pane>
            <el-tab-pane label="工具库管理" name="third">
                <Tool></Tool>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    //文章分类
    import ArticleType from "./articleSet/articleType";
    import Blogroll from "./articleSet/blogroll";
    import Tool from "./articleSet/tool";
    export default {
        data () {
            return {
                activeName: 'first', //tag 切换默认选中
            }
        },

        components: {
            ArticleType,
            Blogroll,
            Tool,
        },

        created () {

        },

        methods: {
            //tab切换
            handleClick (tab, event) {
//                console.log(tab, event);
            },
        }
    }
</script>

<style lang="less" scoped>

</style>
