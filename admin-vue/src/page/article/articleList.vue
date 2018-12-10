<template>
    <div>
        <el-table
            :data="dataList"
            border
            style="width: 100%">
            <el-table-column
                label="日期"
                width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.time }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="type"
                label="类型"
                width="180">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row.id)">编辑
                    </el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="ui-pages">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="15"
                layout="prev, pager, next, jumper"
                :total="pageCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataList: "", //数据集
                currentPage: 1, //当前页
                pageCount:"", //总数据数
            }
        },
        created () {
            this.getData();
        },
        methods: {
            //获取文章列表数据
            getData (page) {
                this.$http.post({
                    "url":"/articleList",
                    "page": page || 1
                },(data) => {
                    this.dataList = data.list;
                    this.pageCount = data.count;
                    this.currentPage = data.currpage;
                });
            },
            //编辑文章
            handleEdit(index, id) {
                this.$router.push({path:"/article",query:{"id":id}});
            },
            //删除文章
            handleDelete(index, id) {
                this.$confirm('此操作将永久删除文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post({
                        "url":"/deleteArticle",
                        "data":{
                            "id":id
                        }
                    },(data)=>{
                        this.$message({
                            message: "删除成功",
                            type: 'success',
                            duration: '1500',
                            center: true
                        });
                        this.getData();
                    })
                });
            },
            //点击和输入分页
            handleCurrentChange(val) {
                this.getData(val);
            }
        }
    }

</script>


<style lang="less" scoped>
    .ui-pages{
        text-align: center;
        margin-top: 20px;
    }
</style>
