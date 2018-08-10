// 格式化时间
export const formatDate = function(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  };
  function padLeftZero (str) {
    return ('00' + str).substr(str.length);
  };
  return fmt;
};


// 参数： 总页数 ， 回调
export const scroll = (totalPage,callback,openLoding,closeLoding) => {
    var currentPage = 1;
    var t = true;
    window.onscroll = () => {
        var $height = document.documentElement.clientHeight;
        var $scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
        var $bottom = document.body.offsetHeight;
        if($height + $scrolltop >= ($bottom - 150)){
            if(t){
                openLoding();
                setTimeout(()=>{
                    currentPage ++;
                    if(currentPage > totalPage){
                        closeLoding();
                        return;
                    }
                    callback(currentPage,function (data) {
                        t = data;
                        closeLoding();
                    });
                },500);
                //防止重复触发
                t = false;
            }
        }
    };
};
