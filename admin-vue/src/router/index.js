import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: "history",
    base: "/admin",
    routes: [
        {
            path: '/',
            redirect: '/articleList'
        },
        {
            path: '/',
            component: resolve => require(['../page/base.vue'], resolve),
            children:[
                {
                    path: "/articleList",
                    name: "articleList",
                    component: resolve => require(["../page/article/articleList.vue"], resolve),
                    meta: { title: "文章列表" }
                },
                {
                    path: "/article",
                    name: "article",
                    component: resolve => require(["../page/article/article.vue"], resolve),
                    meta: { title: '发表文章'}
                },
                {
                    path: "/articleSet",
                    name: "articleSet",
                    component: resolve => require(["../page/article/articleSet.vue"], resolve),
                    meta: { title: '文章设置'}
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../page/login/login.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../page/error/403.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../page/error/404.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
