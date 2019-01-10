<template>
    <div>
        <div class="container">
            <el-form ref="form" :model="form" label-width="80px">
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
                                :value="item.id">
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
                    <el-form-item>
                        <a class="ui2-imglist-btn" href="javascript:;" @click="imgIs(true)">图片列表</a>
                    </el-form-item>
                </div>
            </el-form>
            <!--编辑器-->
            <el-tabs v-model="activeName">
                <el-tab-pane label="markdown编辑器" name="markdown">
                    <!--con：{{form.content}}-->
                    <!--mark:{{form.markdownContent}}-->
                    <MarkDown :markdown="form.markdownContent" @markHtml="markHtml" @markdown="markdown" v-if="activeName == 'markdown'"></MarkDown>
                </el-tab-pane>
                <el-tab-pane label="富文本编辑器" name="text">
                    <QuillEditor :html="form.content" @quillHtml="quillHtml" v-if="activeName == 'text'" ></QuillEditor>
                </el-tab-pane>
            </el-tabs>

            <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>

            <div class="ui-upload-box">
                <div class="ui-coverImg">
                    <p class="ui-text">上传文章封面图片：</p>
                    <el-upload
                        class="avatar-uploader"
                        :action="url"
                        :show-file-list="false"
                        :on-success="upSuccessfm"
                        :on-remove="imgRemovefm"
                        :on-error="upError">
                        <img v-if="form.coverImgUrl" :src="form.coverImgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <el-upload
                    class="upload-demo"
                    :action="url"
                    :on-remove="imgRemove"
                    :on-success="upSuccess"
                    :file-list="fileList"
                    :on-error="upError"
                    list-type="picture">
                    <!--<el-button size="small" type="primary">上传内容图片</el-button>-->
                    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
            </div>
        </div>

        <!--图片列表-->
        <ImgList :dialogVisible="dialogVisible" @imgIs="imgIs" @setCover="setCover"></ImgList>

    </div>
</template>

<script>
    import MarkDown from "./articlePublish/markdown.vue";
    import QuillEditor from "./articlePublish/quillEditor.vue";
    import ImgList from "./articlePublish/imgList.vue";
    export default {
        data: function () {

            return {
                activeName:"markdown", //默认编辑器
                //图片列表
                fileList: [],
                dialogVisible:false, //图片列表 是否打开
                form: {
                    title: "", //标题
                    type: "", //类型
                    content: "", //内容
                    markdownContent:"", //mark内容
                    istop: 0, //置顶值,默认不置顶
                    isreprint: 0, //是否转载 0 否 1 是
                    coverImgUrl: "", //封面图片
                    id: this.$route.query.id || "" //编辑文章的时候用
                },
                typeList: [], //类型列表
                url: sessionStorage.getItem("url") + "/upload" //上传地址
            }

        },
        components: {
            QuillEditor,
            MarkDown,
            ImgList
        },
        methods: {

            //文章内容
            quillHtml (val) {
                this.form.content = val;
            },

            //markdown html
            markHtml(val){
                this.form.content = val;
            },

            //markdown 内容
            markdown (val) {
                this.form.markdownContent = val;
            },

            //img 列表 显示
            imgIs (val) {
                this.dialogVisible = val;
            },

            //设置封面
            setCover(val){
                this.form.coverImgUrl = val;
            },

            //文章提交
            submit() {
                //编辑过来的
                if (this.$route.query.id) {
                    this.$http.post({
                        "url":"/updateArticle",
                        "data": this.form
                    }, (data) => {
                        this.$message({
                            message: "修改成功！",
                            type: 'success',
                            duration: '1500',
                            center: true
                        });
                    })
                } else {
                    //新文章提交
                    this.$http.post({
                        "url":"/article",
                        "data": this.form
                    }, (data) => {
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
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].url == val) {
                        arr.splice(i, 1);
                        return arr;
                    }
                }
            },

            //图片删除
            imgRemove(file, fileList) {
                this.$http.post({
                    url:"/remove",
                    data:{
                        filename: file.name
                    }
                }, req => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.fileList = this.removeByValue(this.fileList, file.url);
                });
            },

            //上传成功
            upSuccess(file) {
                if (file.resultCode == "1") {
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.fileList.push({
                        "hash": file.resultdata.hash,
                        "url": file.resultdata.url,
                        "name": file.resultdata.key,
                    });

                    this.form.content = this.form.content + "<img src='" + file.resultdata.url + "'>";
                } else {
                    this.$message({
                        message: file.resultMsg,
                        type: 'error'
                    });
                }
            },

            //封面上传成功
            upSuccessfm(file) {
                if (file.resultCode == "1") {
                    this.$message({
                        message: '上传成功！',
                        type: 'success'
                    });
                    this.form.coverImgUrl = file.resultdata.url;
                } else {
                    this.$message({
                        message: file.resultMsg,
                        type: 'error'
                    });
                }

            },

            //封面图片删除
            imgRemovefm(file, fileList) {
                this.$http.post({
                    url:"/remove",
                    data:{
                        filename: file.key
                    }
                }, req => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.form.coverImgUrl = "";
                });
            },

            //上传失败
            upError(err, file, fileList) {
                this.$message({
                    message: '上传失败！',
                    type: 'success'
                });
            },

        },
        created() {
            //路由过来的是编辑
            if (this.$route.query.id) {
                this.$http.post({
                    url:"/compileArticle",
                    data:{
                        "id": this.$route.query.id
                    }
                }, (data) => {
                    this.form = data;
                })
            }
            //类型列表
            this.$http.post({
                "url":"/articleType",
            }, req => {
                this.typeList = req;
            });
        }
    }
</script>
<style lang="less" scoped>
    .ui-title {
        margin-bottom: 20px;
        .ui-h1 {
            width: 500px;
        }
        position: absolute;
    }

    .editor-btn {
        margin-top: 20px;
    }

    .ui-flex {
        display: flex;
    }
    .ui2-imglist-btn{
        color: #606266;
    }

    .ui-upload-box {
        display: flex;
        margin-top: 30px;
        .ui-text {
            font-size: 16px;
            color: #888;
            margin-bottom: 10px;
        }
    }

    .ui-coverImg {
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
