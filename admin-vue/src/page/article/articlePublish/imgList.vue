<template>
    <!--图片列表-->
    <div>
        <el-dialog
            title="图片列表"
            :visible.sync="dialogVisible"
            :before-close="imgIs"
            width="60%">
            <el-row :gutter="20">
                <el-col class="ui-el-col" :span="8" v-for="(val,key) in imgDate" :key="key">
                    <el-card :body-style="{ padding: '0px' }">
                        <div class="ui-img-box">
                            <img :src="val.url" class="image">
                        </div>
                        <div style="padding: 14px;text-align: center">
                            <el-button type="text" class="button" @click="copy(val.url)">复制</el-button>
                            <el-button type="text" class="button" @click="imgRemove(val.key)">删除</el-button>
                            <el-button type="text" class="button" @click="setCover(val.url)">设为封面</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <textarea v-show="showTextarea" cols="20" rows="10" id="js-copy" v-model="copyImgUrl"></textarea>

            <span slot="footer" class="dialog-footer">
                  <el-button type="primary" v-if="nextMarker" @click="imgList(nextMarker)">下一页</el-button>
                <el-button @click="imgIs">关 闭</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                imgDate:[], //图片列表
                nextMarker:"", //如果存在就代表有下一页
                copyImgUrl:"", //复制的url地址
                showTextarea: false, // 是否显示复制框
            }
        },
        watch:{

        },
        computed:{

        },

        created () {
            this.imgList();
        },

        methods:{
            //关闭弹窗
            imgIs () {
                this.$emit("imgIs",false);
            },
            //图片列表显示
            imgList (marker) {
                this.$http.post({
                    url:"/qiniuImgList",
                    data:{
                        "limit":9,
                        "marker":marker,
                    },
                }, res => {
                    this.imgDate.push(...res.items);
                    this.nextMarker = res.nextMarker;
                });
            },
            //设置封面
            setCover (url) {
                this.$emit("setCover",url);
            },
            //点击复制
            copy (imgUrl) {
                this.copyImgUrl = imgUrl;
                this.showTextarea = true;
                setTimeout(()=>{
                    var Url2 = document.getElementById("js-copy");
                    Url2.select(); // 选择对象
                    document.execCommand("Copy"); // 执行浏览器复制命令
                    this.$message({
                        message: "已复制好，可贴粘。",
                        center: true,
                        type:"success"
                    });
                    this.showTextarea = false;
                },100);
            },
            //图片删除
            imgRemove(fileName) {
                this.$http.post({
                    url:"/remove",
                    data:{
                        filename: fileName
                    }
                }, req => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                });
            },
        },

        props:["dialogVisible"]
    }
</script>

<style lang="less" scoped>
    .ui-img-box{
        width: 100%;
        height: 200px;
        text-align: center;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .ui-el-col{
        margin-bottom: 20px;
    }
</style>
