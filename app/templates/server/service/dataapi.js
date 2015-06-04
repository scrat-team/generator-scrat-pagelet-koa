var urllib = require('urllib');
var crypto = require('crypto');

///**https://github.com/nodejitsu/node-http-proxy/blob/6201ac76f7aa6847f5fa68506043d8f62ea95810/lib/http-proxy/passes/ws-incoming.js#L44
// * Sets `x-forwarded-*` headers if specified in config.
// *
// * @param {ClientRequest} Req Request object
// * @param {Socket} Websocket
// * @param {Object} Options Config object passed to the proxy
// *
// * @api private
// */
//
//function XHeaders(req, socket, options) {
//  if(!options.xfwd) return;
//
//  var values = {
//    for  : req.connection.remoteAddress || req.socket.remoteAddress,
//    port : common.getPort(req),
//    proto: common.hasEncryptedConnection(req) ? 'wss' : 'ws'
//  };
//
//  ['for', 'port', 'proto'].forEach(function(header) {
//    req.headers['x-forwarded-' + header] =
//        (req.headers['x-forwarded-' + header] || '') +
//        (req.headers['x-forwarded-' + header] ? ',' : '') +
//        values[header];
//  });
//},