//调用分页
var page_count = $(".js-page-count").val();
global_utils.page(page_count,".js-pages");

//搜索
$(".js-serch").on("click",function () {
    var serch_text = $(".js-serch-val").val();
    if(serch_text){
        window.location.href = "?serch=" + serch_text;
    }else {
        layer.msg("请输入内容", {time: 1500});
    }
});

//事件触发
$(document).keyup(function(event){
    if(event.keyCode ==13){
        $(".js-serch").click();
    }
});

//菜单列表
http({
    "url":"/menuList"
},function (data) {
    for (var i = 0 ; i < data.length; i++) {
        var type = global_utils.getUrlParms("type");
        if (type == data[i].type) {
            $(".js-menu-box a").removeClass("layui-this");
            $(".js-menu-box").append(`<a href="?type=${data[i].type}" class="layui-this">${data[i].type}</a>`);
        } else {
            $(".js-menu-box").append(`<a href="?type=${data[i].type}">${data[i].type}</a>`);
        }
    }
});

// 友情链接
http({
   "url":"/blogrollList"
},function (data) {
    data.forEach(function (res) {
        $(".js-friendship").append(
            `<dd>
                <a href="${res.blogUrl}" target="_blank">${res.blogName}</a>
            <dd>`
        )
    });
});

//工具库
http({
    "url":"/toolList"
},function (data) {
    data.forEach(function (res) {
        $(".js-toollist").append(
           `<li>
                <a href="${res.toolUrl}" target="_blank">${res.toolName}</a>
            </li>`
        );
    });
});
