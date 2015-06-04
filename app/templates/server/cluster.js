var cluster = require('cluster');
var os = require('os');
var moment = require('moment');

var app = require('./index');
var cpuCount = (app.env || '').toLocaleLowerCase() === 'production' ? os.cpus().length : 1;
var logger = require('log4js').getLogger('cluster');

if (cluster.isMaster) {
  logger.info('[%s] Start %s(v%s) at %s', app.env.toUpperCase(), app.meta.name, app.meta.version, moment().format('YYYY-MM-DD HH:mm:ss'));
  for (var i = 0; i < cpuCount; i++){
    cluster.fork();
  }
  cluster.on('exit', function (worker) {
    logger.error('Worker ' + worker.id + 'died :(');
    cluster.fork();
  });
} else {
  app.listen(app.port, function () {
    logger.info('[%s] %s server listening on port %d', app.env.toUpperCase(), app.name, app.port);
  });
}