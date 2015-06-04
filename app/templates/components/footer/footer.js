module.exports = (function(){
  var $out = $(".toolbar");
  var $next = $out.find(".right");
  var $prev = $out.find(".left");

  return {
    init : function(data){
      if (data) {
        if (data.next) {
          $next.css("visibility", "");
          $next.find("a").attr("href", "/blog/" + data.next.id);
        }
        else {
          $next.css("visibility", "hidden");
        }

        if (data.previous) {
          $prev.css("visibility", "");
          $prev.find("a").attr("href", "/blog/" + data.previous.id);
        }
        else {
          $prev.css("visibility", "hidden");
        }

        !$out.isShow() && $out.fadeIn(300, function(){
          $out.show();
        });
      }
      else {
        $out.isShow() && $out.fadeOut(300, function(){
          $out.hide();
        });
      }
    }
  };
})();