"use strict";$(function(){var t=$(".js-page-count").val();global_utils.page(t,".js-pages"),$(".js-serch").on("click",function(){var t=$(".js-serch-val").val();t?window.location.href="?serch="+t:layer.msg("请输入内容",{time:1500})}),$(document).keyup(function(t){13==t.keyCode&&$(".js-serch").click()}),http({url:"/api/menuList"},function(t){for(var a=0;a<t.length;a++){global_utils.getUrlParms("type")==t[a].id?($(".js-menu-box a").removeClass("layui-this"),$(".js-menu-box").append('<a href="?type='.concat(t[a].id,'" class="layui-this">').concat(t[a].type,"</a>"))):$(".js-menu-box").append('<a href="?type='.concat(t[a].id,'">').concat(t[a].type,"</a>"))}}),http({url:"/api/blogrollList"},function(t){t.forEach(function(t){$(".js-friendship").append('<dd>\n                <a href="'.concat(t.blogUrl,'" target="_blank">').concat(t.blogName,"</a>\n            <dd>"))})}),http({url:"/api/toolList"},function(t){t.forEach(function(t){$(".js-toollist").append('<li>\n                    <a href="'.concat(t.toolUrl,'" target="_blank">').concat(t.toolName,"</a>\n                </li>"))})})});