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
    import {mapState} from "vuex";
    Vue.use(mavonEditor);

    export default {
        data () {
            return {
                content:"",
            }
        },
        methods:{
            //获取markdown的html内容
            htmlCode (status, val) {
                this.$store.commit("EDITOR_CONTENT",val);
            },
        },
        created () {
            this.content = this.$store.state.EditorContent;
        }
    }
</script>

<style lang="less" scoped>

</style>
