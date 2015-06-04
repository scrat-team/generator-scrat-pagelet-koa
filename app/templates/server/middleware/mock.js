//You must implement ctx.render(view, data) generator function first.

//Use ?__scene[={scene}] querystring to enable mock and select one mock scene.
module.exports = function (options) {
  options.datadir = options.datadir || options.root;
  return require('koa-mock')(options);
};