<template>
    <div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="80px">
                <!--<el-form-item label="时间">-->
                    <!--<el-date-picker-->
                        <!--v-model="form.date"-->
                        <!--type="datetime"-->
                        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                        <!--placeholder="选择日期时间">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <div class="ui-flex">
                    <el-form-item label="类型">
                        <el-select v-model="form.type" placeholder="请选择文章类型">
                            <el-option
                                v-for="item in typeList"
                                :key="item.type"
                                :label="item.type"
                                :value="item.type">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="置顶">
                        <!--<el-input v-model.number="form.istop" type="number"></el-input>-->
                        <el-switch v-model="form.istop" :inactive-value="0" :active-value="1"></el-switch>
                    </el-form-item>
                    <el-form-item label="转载">
                        <el-switch v-model="form.isreprint" :inactive-value="0" :active-value="1"></el-switch>
                    </el-form-item>
                </div>
            </el-form>
            <!--{{form.content}}-->
            <quill-editor class="ui-editor" ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
            <div class="ui-upload-box">
                <div class="ui-coverImg">
                    <p class="ui-text">上传文章封面图片：</p>
                    <el-upload
                        class="avatar-uploader"
                        :action="url"
                        :show-file-list="false"
                        :on-success="upSuccessfm"
                        :on-remove="handleRemovefm"
                        :on-error="upError">
                        <img v-if="form.coverImg" :src="form.coverImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <el-upload
                    class="upload-demo"
                    :action="url"
                    :on-remove="handleRemove"
                    :on-success="upSuccess"
                    :file-list="fileList"
                    :on-error="upError"
                    list-type="picture">
                    <!--<el-button size="small" type="primary">上传内容图片</el-button>-->
                    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    export default {
        data: function(){
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
                //图片列表
                fileList: [],
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
                form: {
                    title: "", //标题
                    type:"", //类型
                    content: '', //内容
                    istop: 0, //置顶值,默认不置顶
                    isreprint: 0, //是否转载 0 否 1 是
                    coverImg: "", //封面图片
                    id: this.$route.query.id || "" //编辑文章的时候用
                },
                value3: true,
                typeList:[], //类型列表
                url: sessionStorage.getItem("url") + "/upload" //上传地址
            }
        },
        components: {
            quillEditor
        },
        methods: {
            //文章提交
            submit () {
                //编辑过来的
                if(this.$route.query.id){
                    this.$http.post("/updateArticle",{
                        "form": this.form
                    },(data)=>{
                        this.$message({
                            message: "修改成功！",
                            type: 'success',
                            duration: '1500',
                            center: true
                        });
                    })
                }else{
                    //新文章提交
                    this.$http.post("/article",{
                        "form": this.form
                    },(data)=>{
                        this.$message({
                            message: "发布成功！",
                            type: 'success',
                            duration: '1500',
                            center: true
                        });
                    });
                }
            },
            //去重函数
            removeByValue(arr, val) {
                for(var i=0; i<arr.length; i++) {
                    if(arr[i].url == val) {
                        arr.splice(i, 1);
                        return arr;
                    }
                }
            },
            //图片删除
            handleRemove(file, fileList) {
                this.$http.post("/remove",{
                    filename: file.name
                }, req => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.fileList = this.removeByValue(this.fileList,file.url);
                });
            },

            //上传成功
            upSuccess (file) {
                if(file.resultCode == "1"){
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.fileList.push({
                        "hash": file.resultdata.hash,
                        "url": file.resultdata.url,
                        "name": file.resultdata.key,
                    });
                    this.form.content = this.form.content + "<img src='" + file.resultdata.url +"'>";
                }else{
                    this.$message({
                        message: file.resultMsg,
                        type: 'error'
                    });
                }
            },


            //封面上传成功
            upSuccessfm(file){
                if(file.resultCode == "1"){
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.form.coverImg = file.resultdata.url;
                } else {
                    this.$message({
                        message: file.resultMsg,
                        type: 'error'
                    });
                }

            },
            //封面图片删除
            handleRemovefm(file, fileList) {
                this.$http.post("/remove",{
                    filename: file.key
                }, req => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.form.coverImg = "";
                });
            },

            //上传失败
            upError (err, file, fileList) {
                this.$message({
                    message: '上传失败！',
                    type: 'success'
                });
            }
        },
        created () {
            //路由过来的是编辑
            if(this.$route.query.id){
                this.$http.post("/compileArticle",{
                    "id": this.$route.query.id
                },(data)=>{
                    this.form = data;
                })
            }
            //类型列表
            this.$http.post("/articleType",{

            }, req => {
                this.typeList = req;
            });
        }
    }
</script>
<style lang="less" scoped>
    .ui-title{
        margin-bottom: 20px;
        .ui-h1{
            width: 500px;
        }
        position: absolute;
    }
    .editor-btn{
        margin-top: 20px;
    }
    .ui-flex{
        display: flex;
    }
    .ui-upload-box{
        display: flex;
        margin-top: 30px;
        .ui-text{
            font-size: 16px;
            color: #888;
            margin-bottom: 10px;
        }
    }
    .ui-coverImg{
        margin-right: 20px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
