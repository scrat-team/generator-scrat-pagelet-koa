var path = require('path');
var koa = require('koa');
var mount = require('koa-mount');
var app = module.exports = koa();

var meta = require('../package.json');
var root = path.resolve(__dirname, '../').replace(/\/+$/, '');

//set env for uae
if(!app.env) {
  if (process.env['UAE_MODE'] === 'PROD') {
    app.env = 'production';
  } else if (process.env['UAE_MODE'] === 'DEV') {
    app.env = 'development';
  }
}
var PROD = (app.env || '').toLocaleLowerCase() === 'production';

app.name = meta.name;
app.proxy = true;
app.meta = meta;
app.port = process.env['PORT'] || 5000;
app.logger = require('./utils/logger').getLogger();
app.root = root;

process.on('uncaughtException', function (err) {
  (app.logger || console).error('Uncaught exception:\n', err.stack);
});

var middleware = {
  accesslog: {
    useFile: PROD,
    root: root + '/private/log',
    maxCount: 7
  },

  combo: {
    root: root + '/public',
    cache: PROD,
    maxAge: PROD ? 60 * 60 * 24 * 365 : 0
  },

  'static': {
    root: root + '/public',
    maxAge: PROD ? 60 * 60 * 24 * 365 : 0
  },

  engine: {
    root: root + '/views',
    ext: 'tpl',
    scrat: {
      map: root + '/config/map.json',
      cacheMap: PROD,
      logger: console
    },
    swig: {
      cache: PROD ? 'memory' : false,
      filters: [
        require('./utils/formatter.js')
      ]
    }
  },

  error: {
    stack: !PROD
  },

  router: {
    root: root + '/server/controller'
  },

  mock: {
    root: root + '/server/mocks'
  }
};

for (var key in middleware) {
  if (middleware.hasOwnProperty(key)) {
    Object.defineProperty(middleware, key, {
      value: require('./middleware/' + key)(middleware[key], app),
      enumerable: true
    });
  }
}

//app.use(require('koa-compress')()); //Use gzip in nginx, instead of in nodejs.
app.use(middleware.accesslog);
app.use(middleware.error);
app.use(require('koa-conditional-get')());
app.use(require('koa-etag')());
app.use(require('koa-response-time')());
app.use(mount('/co', middleware.combo));
app.use(mount('/public', middleware.static));
app.use(middleware.engine);
//if(!PROD){
//  app.use(middleware.mock);
//}
app.use(middleware.router());


app.on('error', function(err, ctx){
  if (app.env.toLowerCase() !== 'test') {
    console.error(err, ctx);
  }
});

if (require.main === module) {
  app.listen(app.port, function () {
    app.logger.info('[%s] %s server listening on port %d', app.env.toUpperCase(), app.name, app.port);
  });
}