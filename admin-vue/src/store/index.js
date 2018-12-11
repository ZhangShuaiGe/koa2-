import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({

    state: {
        imgCover:"", //img文章封面地址
    },

    mutations: {
        //图片封面赋值
        IMG_COVER(state,val){
            state.imgCover = val;
        }
    },

    actions:{

    },

    getters: {

    },
});
