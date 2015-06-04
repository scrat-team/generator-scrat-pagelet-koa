var pageLoading = require("components/loading/page");
var pageTransition = require("components/page-transition");

function dispatchScroll() {
  pagelet.emit("scroll");
  $(".page-content").on('scroll', function()
  {
    pagelet.emit("scroll");
  });
}
// 跑一次
dispatchScroll();

function getDomByPagelets(pagelets) {
  if (typeof(pagelets) == "string") {
    pagelets = pagelets.split(",")
  }

  if (pagelets && pagelets.length == 1) {
    return $("[data-pagelet='" + pagelets[0] + "']");
  }
  return null;
}



pagelet.on(pagelet.EVENT_LOAD_COMPLETED, function(opt){
  dispatchScroll();

  // 页面loading隐藏
  pageLoading.hide();
});

pagelet.on(pagelet.EVENT_BEFORE_LOAD, function(opt){
  if (opt.options.url.indexOf("page=") < 0) {
    // 启用页面loading
    pageLoading.show();
  }
});


pagelet.on(pagelet.EVENT_BEFORE_INSERT_HTML, function(param) {
  if (!param.options.animation || param.options.animation == "none") {
    return;
  }

  var dom = getDomByPagelets(param.options.pagelets);
  if (dom) {
    // clone 当前页面，做假的页面展示
    pageTransition.init(dom);
  }
});

pagelet.on(pagelet.EVENT_AFTER_INSERT_HTML, function(param) {
  if (!param.options.animation || param.options.animation == "none") {
    return;
  }

  var dom = getDomByPagelets(param.options.pagelets);
  if (dom) {
    pageTransition.start(dom, param.options.animation);
  }
});