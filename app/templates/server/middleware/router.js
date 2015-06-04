var fs = require('fs');
var path = require('path');
var cluster = require('cluster');
var Router = require('koa-router');
var mount = require('koa-mount');
var logger = require('log4js').getLogger('router');

module.exports = function (options, app) {
  return function mountRouters() {
    //sugar method app.get/post/...
    require('koa-router')(app);

    //auto mount controllers
    autoMount(app, options.root, options.deep || 2);

    return function *(next) {
      yield next;
    };
  };
};

/**
 * 自动 mount controller
 */
function autoMount(app, root, deep) {
  walkDir(root, null, deep).forEach(function (item) {
    var relative = path.relative(root, item);
    var instance = require(item);

    if (instance) {
      //find mountPath
      var mountPath = instance.mountPath;
      if (!mountPath) {
        var dirName = path.dirname(relative);
        var baseName = path.basename(relative, '.js');
        if (dirName === '.') {
          mountPath = '/' + baseName;
        } else {
          mountPath = '/' + dirName;
        }
      }

      if (instance instanceof Router) {
        //when koa-router
        if (!instance.opts.prefix) {
          instance.prefix(mountPath);
        }
        app.use(instance.routes());
        cluster.isMaster && logger.debug('mount %s from /controller/%s', instance.opts.prefix, relative);
      } else if (instance.constructor.name === 'GeneratorFunction') {
        //when middleware
        app.use(mount(mountPath, instance));
        cluster.isMaster && logger.debug('mount %s from /controller/%s', mountPath, relative);
      } else {
        cluster.isMaster && logger.warn('controller\'s module.exports requires to be a generator function, at %s', relative);
      }
    } else {
      cluster.isMaster && logger.warn('controller have not module.exports, at %s', relative);
    }
  });
}

/**
 * 遍历 controller 目录, 找到所有主文件
 */
function walkDir(root, parent, deep) {
  var result = [];
  var files = fs.readdirSync(root);
  files.forEach(function (file) {
    var fullPath = path.join(root, file);
    var stat = fs.statSync(fullPath);
    if (deep > 0 && stat.isDirectory()) {
      //递归遍历
      result = result.concat(walkDir(fullPath, file, deep - 1));
    } else if (!parent || file === parent + '.js') {
      //根目录下所有文件 || 子目录下主文件
      result.push(fullPath);
    }
  });
  return result;
}