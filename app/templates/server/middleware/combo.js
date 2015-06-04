var path = require('path');
var fs = require('fs');
var merge = require('merge');

//provide combo middleware: /co??f1,f2;/prefix&hash
module.exports = function (options) {
  var regex = /^[^?]*\?\?([^;&?]*)(;[^&?]*)?(&[^&?]*)?/;
  var root = options.root;
  options.maxAge = options.maxAge || 0;

  var cached;
  if (options.cache) {
    cached = require("lru-cache")(merge({
      max: 300,
      maxAge: 1000 * 60 * 60 * 24
    }, options.cacheOptions || {}));
  }

  return function *comboMiddleware(next) {
    var self = this;
    var m = this.originalUrl.match(regex);
    if (m && m[1]) {
      var url = m[1];
      var prefix = m[2] || '';
      //var hash = m[3] || '';

      if (prefix.indexOf('../') !== -1) {
        self.throw('[combo] malicious prefix: ' + prefix + ' , originalUrl: ' + self.originalUrl , 400, {url: self.originalUrl});
      } else {
        var basePath = path.join(root, prefix.replace(/^\//, ''));
        var files = url && url.split(',');
        var contents = files.map(function (file) {
          //only allow css/js
          var ext = path.extname(file);
          if (ext !== '.css' && ext !== '.js' || file.indexOf('../') !== -1) {
            self.throw('[combo] malicious file: ' + file +  ' , originalUrl: ' + self.originalUrl, 400, {url: self.originalUrl});
          } else {
            var realPath = path.resolve(basePath, file);
            //check cached
            var content = cached && cached.get(realPath);
            //read from filesystem
            if(!content) {
              try {
                content = content || fs.readFileSync(realPath, 'utf-8');
                if(cached){
                  cached.set(realPath, content);
                }
              } catch (err) {
                self.throw('[combo] ' + err.code + ': ' + (err.path && err.path.replace(root + '/', '')), 400, {
                  url: self.originalUrl,
                  error: err
                });
              }
            }
            return content;
          }
        });

        if (contents.length !== files.length) {
          self.throw('[combo] some file not found , originalUrl: ' + self.originalUrl, 400, {url: self.originalUrl});
        } else {
          //set headers
          var ext = path.extname(url);
          if (ext) {
            self.type = ext.slice(1);
          }
          self.set('Cache-Control', 'public,max-age=' + options.maxAge);
          self.body = contents.join('\n');
        }
      }
    } else {
      self.throw('I am a combo service, Usage: /co??f1,f2;/prefix&hash , originalUrl: ' + self.originalUrl, 400, {url: self.originalUrl});
    }
  }
};
