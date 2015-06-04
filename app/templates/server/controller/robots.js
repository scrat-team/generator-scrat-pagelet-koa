module.exports = exports = function * robotAction(next) {
  this.type = 'text/plain';
  this.set('Cache-Control', 'public,max-age=86400');
  this.body = "User-agent: *\nDisallow: /";
};

module.exports.mountPath = '/robots.txt';