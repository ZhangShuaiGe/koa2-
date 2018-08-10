<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from '@/components/Header.vue';
    import vSidebar from '@/components/Sidebar.vue';
    import bus from '@/components/bus';
    import router from "vue-router";
    export default {
        data(){
            return {
                collapse: false
            }
        },
        components:{
            vHead,
            vSidebar
        },
        created(){
//            router.beforeEach((to, from, next) => {
//                console.log(to.meta.title);
//                next()
//            });
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
