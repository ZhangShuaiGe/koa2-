import axios from "axios";
import { Message } from 'element-ui';

// 登录
var login = window.location.origin + "/admin/login";

if(process.env.NODE_ENV == "development"){
    axios.defaults.baseURL = "/api/admin";
}else{
    axios.defaults.baseURL = "/admin";
}

// 上传图片用，区分环境
sessionStorage.setItem("url",axios.defaults.baseURL);

export const http = {
    post(config,success, errcallback) {
        return axios({
            method: "post", // 请求协议
            url: config.url, // 请求的地址
            data: config.data,
        })
        .then((result) => {
            if (result.data.resultCode == "1") {
                success(result.data.resultdata);
            } else if (result.data.resultCode == "0") {
                Message({
                    message: result.data.resultMsg,
                    duration: '1500',
                    center: true
                });
                if(errcallback){
                     errcallback(result);
                }
            } else if (result.data.resultCode == "-1") {
                Message({
                    message: "会话过期,请重新登录",
                    duration: '1500',
                    center: true
                });
                setTimeout(function () {
                    window.location.href = login;
                },1500);
            }
        }).catch((error) => {
            console.log(error);
        });
    }
};
