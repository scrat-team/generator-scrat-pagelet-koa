var moment = require('moment');

/**
 * 格式化时间间隔
 */
exports.formatRelativeTime = function (str) {
  var date = moment(str);
  var now = moment();
  var diff = now.diff(date, 'second');

  if (diff <= 30) {
    return "刚刚";
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + "分钟前";
  } else if (date.isSame(now, 'day')) {
    return date.format('HH:mm:ss');
  } else if (date.isSame(now, 'year')) {
    return date.format('MM-DD HH:mm:ss');
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
};