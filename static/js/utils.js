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

    // 代码高亮插件调用
    $('pre').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //github登陆点击
    var new_window = null;
    $(".js-githubLogin").on("click",function () {
        let Url = "https://github.com/login/oauth/authorize?client_id=cd5ff8839b5e6448b7f3&redirect=http://192.168.1.44:3000/githubLogin&state=" + Math.random();
        let config = 'height=600, width=600, top=0, left=0';
        new_window = window.open(Url,'newWindow',config);
        return false;
    });

    //关闭github登录
    $("#js-close_github").on("click",function () {
        new_window.close();
        window.location.href="/";
    });

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

    // github登录
    if(global_utils.getUrlParms("code")){
        $.ajax({
            url:"https://github.com/login/oauth/access_token",
            type:"post",
            data:{
                "client_id":"c3c5a21740b090d6e2e6",
                "client_secret":"f5172492f382f6ef711e5e9c963959777b59bfad",
                "code":global_utils.getUrlParms("code"),
                "state":global_utils.getUrlParms("state"),
            },
            success:function (data) {
                alert("陈宫！");
                $.ajax({
                    url:"https://api.github.com/user?" + data,
                    type:"get",
                    success:function (data2) {
                        console.log(111,data2);
                    }
                });
            }
        })
    }

    // $.ajax({
    //     url:"https://api.github.com/user?access_token=d36549fb6bd8abdc001576dbf13b78586069cfe4&scope=&token_type=bearer",
    //     type:"get",
    //     success:function (data2) {
    //         console.log(111,data2);
    //     }
    // });

    window.global_utils = global_utils;
});
