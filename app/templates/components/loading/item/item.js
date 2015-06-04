var loadCSS = require("components/utils/load-css");

module.exports = (function(){
  var html = __inline("item.tpl");
  var css = __inline("item.css");
  var id = ("loading_item_" + Math.random()).replace(".", "_");

  return {
    append : function($dom){
      loadCSS(css);
      $(html).attr("id", id).appendTo($dom);
    },
    show : function() {
      $("#" + id).show();
    },
    hide : function() {
      $("#" + id).hide();
    }
  };
})();