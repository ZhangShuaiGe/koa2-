<template>
    <!--图片列表-->
    <div>
        {{dialogVisible}}
        <el-dialog
            title="图片列表"
            :visible.sync="dialogVisible"
            width="30%">

            <el-row>
                <el-col :span="8" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 2 : 0">
                    <el-card :body-style="{ padding: '0px' }">
                        <img src="http://img.zhangshuaige.top/1544006192395.jpg" class="image">
                        <div style="padding: 14px;">
                            <span>好吃的汉堡</span>
                            <div class="bottom clearfix">
                                <time class="time">111111</time>
                                <el-button type="text" class="button">操作按钮</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>


            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState , mapMutations} from 'vuex'
    export default {
        data () {
            return {

            }
        },
        watch:{

        },
        computed:{

        },

        created () {

        },

        methods:{

        },

        props:["dialogVisible"]
    }
</script>

<style lang="less" scoped>

</style>
