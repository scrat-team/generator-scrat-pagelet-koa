var path = require('path');
var swig = require('scrat-swig');
var merge = require('merge');

module.exports = function (options, app) {
  options.ext = options.ext || 'tpl';

  //extend swig with scrat
  extendSwig(options);
  swig.middleware(options.scrat);

  //add `render` fn to app, usage: `yield this.render(tplPath, locals);`
  app.context.render = getRenderFn(options);

  return function *swigMiddleware(next){
    var pagelets = this.get('X-Pagelets');
    if(pagelets){
      this.set('Content-Type', 'application/json');
      //this.set('Cache-Control', 'no-cache, no-store');
      //this.set('Pragma', 'no-cache');
      //this.set('Expires', 0);
      this.state._pagelets = pagelets;
    }
    yield next;
  };
};

function extendSwig(options){
  var swigOptions = options.swig || {};

  //custom filters
  if(swigOptions.filters){
    var filters = swigOptions.filters;
    filters = Array.isArray(filters) ? filters : [filters];
    filters.forEach(function(obj){
      for(var filterName in obj){
        if(obj.hasOwnProperty(filterName)){
          swig.setFilter(filterName, obj[filterName]);
        }
      }
    });
    delete swigOptions.filters;
  }

  //custom tags
  if(swigOptions.tags){
    var tags = swigOptions.tags;
    tags = Array.isArray(tags) ? tags : [tags];
    tags.forEach(function(obj) {
      for (var tagName in obj) {
        if (obj.hasOwnProperty(tagName)) {
          var tag = tags[tagName];
          swig.setTag(tagName, tag.parse, tag.compile, tag.ends, tag.blockLevel);
        }
      }
    });
    delete swigOptions.tags;
  }

  //custom extensions
  if(swigOptions.extensions){
    var extensions = swigOptions.extensions;
    extensions = Array.isArray(extensions) ? extensions : [extensions];
    extensions.forEach(function(obj) {
      for (var extName in obj) {
        if (obj.hasOwnProperty(extName)) {
          swig.setExtension(extName, obj[extName]);
        }
      }
    });
    delete swigOptions.extensions;
  }

  //defaults
  swig.setDefaults(swigOptions);
}

function getRenderFn(options) {
  function renderFile(pathName, locals) {
    return function (done) {
      swig.renderFile(pathName, locals, done);
    };
  }

  return function *render(view, locals) {
    // default extname
    var ext = path.extname(view);

    if (!ext) {
      ext = '.' + options.ext;
      view += ext;
    }

    // resolve
    view = path.resolve(options.root, view);

    var data = merge(this.state, {flash: this.flash}, locals);

    var html = yield renderFile(view, data);
    if (!options.custom) {
      this.body = html;
    }
    return html;
  }
}