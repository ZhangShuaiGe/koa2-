<template>
    <div>
        <mavon-editor @change="htmlCode" v-model="content"/>
    </div>
</template>

<script>
    //markdown
    import Vue from 'vue'
    import mavonEditor from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    Vue.use(mavonEditor);

    export default {
        data () {
            return {
                content:"",
            }
        },
        watch:{
            content (newValue) {
                //markdonw 语法
                this.$emit("markdown",newValue);
            },
            markdown () {
                //编辑文章的时候，是异步传值，需要监听
                this.content = this.markdown;
            }
        },

        props:["markdown"],

        methods:{
            htmlCode(status, html){
                //html源码
                this.$emit("markHtml",html);
            },
        },

        created () {
            this.content = this.markdown;
        }

    }
</script>

<style lang="less" scoped>

</style>
