var moment = require('moment');
var startupTime = moment().format('YYYY-MM-DD HH:mm:SSS');

module.exports = exports = function * statusAction(next){
  var meta = this.app.meta;
  this.status = 200;
  this.type = "json";
  this.body = {
    name: meta.name,
    version: meta.version,
    msg: 'page is ok',
    startupTime: startupTime,
    buildInfo: meta.buildInfo
  };
};