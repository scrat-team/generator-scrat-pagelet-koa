var regex = /^\/(index(\.html?)?)?$/;

module.exports = exports = function * indexAction(next) {
  if (regex.test(this.path)) {
    this.type = 'text/plain';
    this.body = "九游客户端";
  } else {
    yield next;
  }
};

module.exports.mountPath = '/';