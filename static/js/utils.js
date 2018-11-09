// 业务型公共js
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

    //提示
    $(".js-developed").on("click",function () {
        layer.msg("正在开发，敬请期待！");
        return false;
    });

    // 昵称 和 退出 显示
    var nikename = $.cookie('nikename');
    if (nikename) {
        $(".js-login").show();
        $(".js-nikename").html(decodeURI(nikename));
    } else {
        $(".js-loginOut").show();
    }

    // 方法型公共js
    var global_utils = {

        // 分页  count(总数据数量) name(class的名字 || 或id)
        page : function (count,name) {

            var currpage = this.getUrlParms("page");

            //调用分页
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: $(name), //注意，这里的 test1 是 ID，不用加 # 号
                    count: count, //数据总数，从服务端得到
                    limit:15, //每页多少条数据
                    curr: currpage, // 当前页
                    jump:function (obj, first) {
                        //首次不执行
                        if(!first){
                            // 如果在文章详情，url会有id=xx 参数
                            if (global_utils.getUrlParms("id")) {
                                location.href= location.href.split("&page")[0] + "&page=" + obj.curr;
                            } else {
                                location.href= "?page=" + obj.curr;
                            }
                        }
                    }
                });
            });

            //分页为0 隐藏分页
            if (Number(count) < 15) {
                $(name).hide();
            }
        },

        //获取地址栏参数，name:参数名称
        getUrlParms : function (name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if( r!= null )
                return unescape(r[2]);
            return null;
        },

    };

    window.global_utils = global_utils;
});
