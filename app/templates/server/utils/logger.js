var log4js = require('log4js');

module.exports = log4js;

log4js.configure({
  replaceConsole: true,
  appenders: [
    { type: 'console', layout: process.env['NODE_ENV'] === 'production' && { type: "basic" }}
  ],
  levels: {
    "[all]": "INFO",
    "router": "DEBUG"
  }
});

var dataFormatter = require('log4js/lib/date_format.js');
dataFormatter.ISO8601_FORMAT = 'yy-MM-dd hh:mm:ss';