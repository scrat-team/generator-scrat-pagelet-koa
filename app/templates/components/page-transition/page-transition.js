
module.exports = (function(){
  var $cache = null;
  var $compare = null;

  /**
  * 动画方案一：使用zepto-fx的slideLeft效果
  */
  var animation_JS = {
    init : function($dom) {
      $compare = $dom;

      // clear
      $dom.find(".fake").remove();

      $dom.children().css({
        "position":"absolute",
        "background-color" : "#efeff4"
      });

      $cache = $dom.children().clone().addClass("fake");
    },
    start : function($dom, animation) {
      if ($compare.selector != $dom.selector) {
        console.error("not the same!");
        return;
      }

      if (!animation || animation=="none") {
        return;
      }
      // 滚动到顶部
      //$(".page-content").scrollTop(0);

      var $children = $dom.children();

      if ($cache) {
        $cache.prependTo($dom).fadeOut(200, function(){
          $(this).remove();
        });
        $cache = null;
      }

      $children.css({
        "position":"absolute",
      });

      $children[animation != "none" ? animation : "show"](400, function(){
        $children.css("position", "");
      });
    }
  };

  /**
  * 动画方案二：使用framework7的样式控制
  */
  var animation_ClassName = {
    init : function($dom) {
      $compare = $dom;

      // clear
      $dom.find(".fake").remove();

      $cache = $dom.children().clone().addClass("fake");
    },
    start : function($dom, animation){
      if ($compare.selector != $dom.selector) {
        console.error("not the same!");
        return;
      }

      if (!animation || animation=="none") {
        return;
      }

      var $children = $dom.children();

      // so far: slideLeft|slideRight|none
      if (animation != "none") {
        if ($cache) {
          if (animation == "slideLeft") {
            $cache.appendTo($dom);
            $cache.addClass("page-on-center page-from-center-to-left");
            $children.addClass("page-on-right page-from-right-to-center");
          }
          else if(animation == "slideRight") {
            $cache.prependTo($dom);
            $cache.addClass("page-on-center page-from-center-to-right");
            $children.addClass("page-on-left page-from-left-to-center");
          }

          $cache.fadeOut(100);
          setTimeout(function(){
            $children
              .removeClass("page-on-left")
              .removeClass("page-on-right")
              .removeClass("page-from-left-to-center")
              .removeClass("page-from-right-to-center")
              .addClass("page-on-center");
            $cache.remove();
            $cache = null;
          },500);
        }


      }
    }
  };

  return animation_JS;
})();