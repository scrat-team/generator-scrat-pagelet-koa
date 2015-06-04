var cluster = require('cluster');
var path = require('path');
var merge = require('merge');
var fs = require('fs');
var morgan = require('koa-morgan');
var rotator = require('file-stream-rotator');
var moment = require('moment');
var logger = require('log4js').getLogger();

morgan.token('moment', function(req, res){
  return moment().format('MM-DD HH:mm:ss');
});

module.exports = function (options, app) {
  var format = options.format || ':remote-addr - :remote-user [:moment] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :res[X-Response-Time] :res[X-Server-Response-Time]ms';
  if(options.useFile){
    options.stream = rotator.getStream(merge({
      filename: path.join(options.root, 'accesslog_%DATE%.log'),
      frequency: 'daily',
      verbose: false,
      date_format: 'YYYYMMDD'
    }, options['fileOptions']))
  }

  //是否记录图片和js/css
  var skipExt = [];
  if(!options['logImage']){
    skipExt = skipExt.concat(['.png', '.jpeg', '.jpg', '.ico']);
  }
  if(!options['logResource']){
    skipExt = skipExt.concat(['.js', '.css']);
  }

  options.skip = function (req, res) {
    var originalUrl = req.originalUrl || req.url;
    var ext = path.extname(originalUrl).toLocaleLowerCase();
    var isSkip = skipExt.indexOf(ext) !== -1;
    return isSkip && res.statusCode < 400;
  };

  if(options.maxCount > 0){
    startJob(options.root, options.maxCount);
  }
  return morgan.middleware(format, options);
};

//每天自动执行
function startJob(logDir, maxCount){
  if(cluster.isMaster){
    deleteOldLog(logDir, maxCount);
    //每天晚上2点
    var nextTime = moment().add(1, 'd').add(2, 'h').startOf('day').diff(moment());
    setTimeout(function(){
      startJob(logDir, maxCount);
    }, nextTime);
  }
}

//删除历史日志
function deleteOldLog(logDir, maxCount){
  maxCount = maxCount || 7;
  var oldDate = moment().subtract(maxCount, 'd').startOf('day');
  fs.readdir(logDir, function (err, files) {
    if (err) {
      console.error(err);
    } else {
      var toDeleteLog = files.filter(function (name) {
        var m = name.match(/access_(\d+)\.log/);
        if (m) {
          return moment(m[1], 'YYYYMMDD').isBefore(oldDate);
        }
      });

      logger.info('Delete old file before %s days(%s): [%s]', maxCount, oldDate.format('MM-DD HH:mm:SS'), toDeleteLog.join(', '));
      if(toDeleteLog.length) {
        toDeleteLog.forEach(function(file){
          var realPath = path.join(logDir, file);
          if(fs.existsSync(realPath)){
            fs.unlink(realPath, function(err) {
              if (err) {
                console.error(process.pid, err);
              }
            })
          }
        });
      }
    }
  });
}