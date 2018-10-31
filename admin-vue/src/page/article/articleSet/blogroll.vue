<template>
    <div>
        <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="selectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="blogName"
                label="分类">
            </el-table-column>
            <el-table-column
                prop="blogUrl"
                label="地址">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="compile(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection()">取消选择</el-button>
            <el-button @click="dialogFormVisible = true">添加</el-button>
            <el-button @click="removeSelect()">删除</el-button>
        </div>

        <el-dialog title="添加友情链接" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="链接名称：" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接地址：" :label-width="formLabelWidth">
                    <el-input v-model="form.url" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                list:[],
                dialogFormVisible: false, //弹出层
                form: {
                    name:"",
                    url:"",
                    blogId:"",
                },
                selectId:[],
                isRemove: false, //是否是刪除
                isCompile: false, //是否是编辑
                formLabelWidth:"120px"
            }
        },
        created () {
            this.listApi();
        },
        methods:{
            //友链列表
            listApi (currentPage) {
                this.$http.post("/blogroll",{
                    "currentPage": currentPage || 1,
                }, res => {
                    this.list = res.rows;
                })
            },
            //添加,编辑，删除
            submit () {
                this.$http.post("/blogroll",{
                    "name": this.form.name,
                    "url": this.form.url,
                    "blogId": this.selectId,
                    "isRemove": this.isRemove,
                    "isCompile": this.isCompile,
                }, res => {
                    this.$message({
                        type: 'success',
                        message: res,
                    });
                    this.listApi();
                    this.isRemove = false;
                    this.isCompile = false;
                    this.dialogFormVisible = false;
                }, err => {
                    this.isRemove = false;
                    this.isCompile = false;
                })
            },
            //刪除
            remove (data) {
                this.isRemove = true;
                this.selectId = [data.id];
                this.submit();
            },
            //批量删除
            removeSelect(){
                this.isRemove = true;
                this.submit();
            },
            //编辑
            compile (data) {
                this.dialogFormVisible = true;
                this.form.url = data.blogUrl;
                this.form.name = data.blogName;
                this.isCompile = true;
            },
            //选中的值
            selectionChange (data) {
                this.selectId = [];
                data.forEach(res => {
                    this.selectId.push(res.id);
                });
            },
            //取消全选
            toggleSelection(rows) {
                this.$refs.multipleTable.clearSelection();
            },
        },
    }
</script>

<style lang="less" scoped>

</style>
