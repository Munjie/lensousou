function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


 // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('/') 
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function gethour(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
   return  [hour].map(formatNumber)
 // return [year, month, day].map(formatNumber).join('/')
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatHour(date){
   var hour =   gethour(date);
  if (5 <= hour && hour < 7){
     return "清晨"
   } else if (7 <= hour && hour <9) {
     return "早上"
   } else if (9 <= hour && hour < 12) {

     return "上午"
   } else if (12 <= hour && hour < 14) {

     return "中午"
   } else if (14 <= hour && hour < 18) {

     return "下午"
   } else if (18 <= hour && hour < 19) {

     return "傍晚"

   } else if (19 <= hour && hour <23) {

     return "晚上"
   } else {

     return "凌晨"
   }

}
function warminfo(date) {
  var hour = gethour(date);
  if (0 <= hour && hour < 5) {
    return "夜深了，别熬夜，早点休息噢！"
  } else if (5 <= hour && hour < 7) {
    return "又是美好的一天开始了！"
  } else if (7 <= hour && hour < 8) {

    return "早安，世界！"
  } else if (12 <= hour && hour < 13) {

    return "该吃中饭了噢"
  } else if (14 <= hour && hour < 18) {

    return "下午好哇"
  } else if (18 <= hour && hour < 19) {

    return "晚餐时刻！"

  } else if (22 <= hour) {

    return "晚安，世界！"
  } else {

    return "每天都要保持微笑"
  }

}

module.exports = {
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  formatHour: formatHour,
  gethour: gethour,
  warminfo: warminfo
}