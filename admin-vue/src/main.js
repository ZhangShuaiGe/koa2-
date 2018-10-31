import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import {
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Table,
    TableColumn,
    Pagination,
    button,
    RadioButton,
    CheckboxButton,
    Button,
    ButtonGroup,
    Upload,
    Form,
    FormItem,
    Input,
    InputNumber,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DatePicker,
    Select,
    Option,
    OptionGroup,
    Message,
    Tabs,
    TabPane,
    MessageBox,
    Dialog,
    Switch
} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import {http} from "./config/http";
import {api} from "./config/api";
import "../static/less/base.less";

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(RadioButton);
Vue.use(RadioButton);
Vue.use(CheckboxButton);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Upload);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Dialog);
Vue.use(Switch);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

// 全局注册 http 和 接口
Vue.prototype.$http = http;
Vue.prototype.$api = api;
// Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if(!role && to.path !== '/login'){
//         next('/login');
//     }else if(to.meta.permission){
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     }else{
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         }else{
//             next();
//         }
//     }
// });

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
