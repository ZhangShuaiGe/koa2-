<template>
    <div>
        <!--{{form.content}}-->
        <quill-editor class="ui-editor" ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
    </div>
</template>

<script>
    //富文本
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import {mapState,mapMutations} from "vuex";
    export default {
        data () {
            const toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],
                ['link', 'image', 'video'],
                ['clean']                                         // remove formatting button
            ];
            return {
                //富文本配置
                editorOption: {
                    placeholder: 'Hello World',
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        //触发ele上传
                                        document.querySelector(".upload-demo .el-upload__input").click();
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },
                content:"",
            }
        },
        computed:{
            ...mapState([
                "EditorContent",
            ])
        },
        watch:{
            content (newVaule) {
                this.EDITOR_CONTENT(newVaule);
            },
            EditorContent (newValue) {
                this.content = newValue;
            },
        },
        created(){
            this.content = this.EditorContent;
        },
        methods:{
            ...mapMutations([
               "EDITOR_CONTENT",
            ]),
        },
        components:{
            quillEditor,
        }
    }
</script>

<style lang="less" scoped>

</style>
