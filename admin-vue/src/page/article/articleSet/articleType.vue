<template>
    <div>
        <el-table
            ref="multipleTable"
            :data="tableType"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="TypeSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="type"
                label="分类"
                width="120">
            </el-table-column>
            <el-table-column
                prop="sort"
                label="位置"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="compileType(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="removeType(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection()">取消选择</el-button>
            <el-button @click="addType()">添加</el-button>
            <el-button @click="removeTypeBatch()">删除</el-button>
        </div>
        <el-dialog title="类型" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="名称：" :label-width="formLabelWidth">
                    <el-input v-model="form.type" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序：" :label-width="formLabelWidth">
                    <el-input v-model="form.sort" autocomplete="off"></el-input>
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
                tableType: [], //分类列表
                TypeSelection: [], //选中的 分类 id
                dialogFormVisible:false,
                formLabelWidth:"120px",
                form:{
                    type:"",
                    sort:"",
                    id:"",
                },
            }
        },

        created(){
            this.TypeApi();
        },

        methods:{
            //分类api
            TypeApi(){
                this.$http.post("/articleType",{

                }, data => {
                    this.tableType = data;
                })
            },
            //删除分类
            removeType(data){
                this.$confirm('删除分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/articleDelete",{
                        "id":data.id
                    }, res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.TypeApi();
                    });
                })

            },
            //分类批量删除
            removeTypeBatch(){
                this.$confirm('批量删除分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/articleDelete",{
                        "id": this.TypeSelection
                    }, res => {
                        this.$message({
                            type: 'success',
                            message: "删除成功!",
                        });
                        this.TypeApi();
                    })
                });
            },
            //添加分类
            addType(){
                this.dialogFormVisible = true;
            },
            submit(){
                if(this.form.id){
                    this.$http.post("/articleCompile",{
                        "id": this.form.id,
                        "type": this.form.type,
                        "sort":this.form.sort,
                    }, data => {
                        this.$message({
                            type: 'success',
                            message: "修改成功！"
                        });
                        this.dialogFormVisible = false;
                        this.form = {};
                        this.TypeApi();
                    })
                }else{
                    this.$http.post("/articleType",{
                        "type": this.form.type,
                        "sort": this.form.sort
                    }, data => {
                        this.$message({
                            type: 'success',
                            message: data.resultMsg
                        });
                        this.dialogFormVisible = false;
                        this.form = {};
                        this.TypeApi();
                    })
                }
            },
            //编辑分类
            compileType(data){
                this.dialogFormVisible = true;
                this.form.type = data.type;
                this.form.sort = data.sort;
                this.form.id = data.id;
            },
            //取消全选
            toggleSelection(rows) {
                this.$refs.multipleTable.clearSelection();
            },
            //选中的值
            TypeSelectionChange(val) {
                this.TypeSelection = [];
                val.forEach(data => {
                    this.TypeSelection.push(data.id);
                });
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
