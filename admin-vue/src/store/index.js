import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({

    state: {
        EditorContent : "", //编辑器内容
    },

    mutations: {
        EDITOR_CONTENT (store,val) {
            store.EditorContent = val;
        }
    },

    actions:{

    },

    getters: {

    },
});
