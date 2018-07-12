$(function () {

    //获取验证码
    $(".js-vercode").on("click",function () {
        http({
            url:"/vercode",
        },function (data) {
            $(".js-vercode").attr("src",data.url);
        });
    });

    // 退出
    $(".js-loginOut").on("click",function () {
        $.cookie('token',"");
        $.cookie('nikename',"");
        location.reload();
    });

});