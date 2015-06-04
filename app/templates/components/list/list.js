var lazy = require("components/utils/img-lazyload/img-lazyload.js");
var loading = require("components/loading/item");

// 插入loading
loading.append($(".index-list"));

loading_lock = false;
loaded_page = 1;

pagelet.on("scroll", function(){
  // 触发lazy load
  lazy.trigger();

  var target = $(".page-content")[0];
  var total_height = target.scrollHeight
  var scroll_height = target.scrollTop
  var screen_height = window.innerHeight
  var nearBottom = screen_height + scroll_height >= total_height - 20; //50换缓冲


  if(!loading_lock // 非加载中状态
    && nearBottom // 靠近底部
    && $("[data-pagelet='layout.main.list']").length) // 列表才做
  {
    loading.show();

    loading_lock = true;
    pagelet.load({
      url : "/blog?page=" + (loaded_page + 1),
      pagelets : ["layout.main.list"],
      replace : "append",
      success : function(data, done){
        loaded_page++;
        loading_lock = false;
        $(".cards-list").append(data.html["layout.main.list"]);
        loading.hide();

        done();
      }
    });
  }
});
