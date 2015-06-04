var serve = require('koa-static');

module.exports = function (options) {
  var root = options.root;
  delete options.root;
  return serve(root, options);
};