module.exports = (function(){
  var $out = $(".navbar");
  var $left = $out.find(".left");
  var $center = $out.find(".center");
  var $right = $out.find(".right");

  return {

    TYPE_LIST : "list",
    TYPE_DETAIL : "detail",

    setTitle : function(title) {
      $center.html(title);
    },

    setType : function(type) {
      if (type == this.TYPE_LIST) {
        $left.css("visibility","hidden");
        $center.css("visibility","");
        $right.css("visibility","");
      }
      else if (type == this.TYPE_DETAIL){
        $left.css("visibility","");
        $center.css("visibility","");
        $right.css("visibility","hidden");
      }
    }
  };
})();