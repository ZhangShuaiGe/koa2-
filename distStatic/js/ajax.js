;(function () {
    function http(setting,callback) {
        $.ajax({
            type: setting.type || "post",
            url: setting.url,
            data: setting.data,
            async: setting.async || false,
            headers: {'Authorization': $.cookie('token')},
            success:function (data) {
                if (data.resultCode == "1") {
                    callback(data.resultdata);
                } else if(data.resultCode == "-1") {
                    layer.msg('登录超时，请重新登录', {
                        time: 1500
                    });
                    setTimeout(function () {
                        window.location.href="/login";
                    },1500);
                } else {
                    layer.msg(data.resultMsg, {
                        time: 1500
                    });
                }
            }
        });
    }
    window.http = http;
})();