module.exports = function (options) {
  return function *errorMiddleware(next) {
    var self = this;
    try {
      yield next;
    } catch (err) {
      // some errors will have .status, however this is not a guarantee
      self.status = err.status || 500;
      self.type = 'html';
      self.body = options.stack ? err.stack : err.message;

      // since we handled this manually, we'll want to delegate to the regular app level error handling as well, so that centralized still functions correctly.
      self.app.emit('error', err, self);
    }
  }
};