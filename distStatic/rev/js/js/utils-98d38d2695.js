"use strict";$(function(){$(".js-vercode").on("click",function(){http({url:"/vercode"},function(o){$(".js-vercode").attr("src",o.url)})}),$(".js-loginOut").on("click",function(){$.cookie("token",""),$.cookie("nikename",""),$.cookie("avatarUrl",""),location.reload()}),$(".js-developed").on("click",function(){return layer.msg("正在开发，敬请期待！"),!1});var o=$.cookie("nikename");o?($(".js-login").show(),$(".js-nikename").html(decodeURI(o))):$(".js-loginOut").show(),$("pre").each(function(o,e){hljs.highlightBlock(e)});var e=null;$(".js-githubLogin").on("click",function(){var o="https://github.com/login/oauth/authorize?client_id=cd5ff8839b5e6448b7f3&redirect=https://www.zhangshuaige.top/user/githubLogin&state="+Math.random();return e=window.open(o,"newWindow","height=600, width=600, top=0, left=0"),!1}),$.cookie("avatarUrl")&&$(".js-avatar_url").attr("src",$.cookie("avatarUrl")),$("#js-close_github").on("click",function(){e.close(),window.location.href="/"});var t={page:function(o,e){var n=this.getUrlParms("page");layui.use("laypage",function(){layui.laypage.render({elem:$(e),count:o,limit:15,curr:n,jump:function(o,e){e||(t.getUrlParms("id")?location.href=location.href.split("&page")[0]+"&page="+o.curr:location.href="?page="+o.curr)}})}),Number(o)<15&&$(e).hide()},getUrlParms:function(o){var e=new RegExp("(^|&)"+o+"=([^&]*)(&|$)"),n=window.location.search.substr(1).match(e);return null!=n?unescape(n[2]):null}};window.global_utils=t});