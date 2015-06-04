var header = require("components/header");
var footer = require("components/footer");

module.exports = (function(){

  return {
    setTitle : function(title){
      header.setTitle(title);
    },
    setType : function(type){
      header.setType(type);
    },
    setNav : function(nav){
      footer.init(nav);
    }
  };
})();