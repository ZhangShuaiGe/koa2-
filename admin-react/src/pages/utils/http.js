import axios from "axios";
import { message } from 'antd';

// 登录
var login = window.location.origin + "/admin/login";

// react 代理不需要添加设置 /api
// if(process.env.NODE_ENV == "development"){
//
// }else{
//     axios.defaults.baseURL = "/admin";
// }

axios.defaults.baseURL = "/admin";

export const http = {
    post(config,success, errcallback) {
        return axios({
            method: "post", // 请求协议
            url: config.url, // 请求的地址
            data: config.data,
        })
        .then((result) => {
            if (result.data.resultCode === 1) {
                success(result.data.resultdata);
            } else if (result.data.resultCode === 0) {
                message.error(result.data.resultMsg);
                if(errcallback){
                    errcallback(result);
                }
            } else if (result.data.resultCode === -1) {
                message.error('登录超时，请重新登录！');
                setTimeout(function () {
                    window.location.href = login;
                },1500);
            }
        }).catch((error) => {
            console.log(error);
        });
    },
};
