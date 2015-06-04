module.exports = (function(){
  var html = __inline("page.tpl");
  var id = ("loading_page_" + Math.random()).replace(".", "_");

  return {
    show : function() {
      this.hide();
      $(html).attr("id", id).appendTo("body");
    },
    hide : function() {
      $("#" + id).remove();
    }
  };
})();