// 自定义动画扩展
;(function($, undefined){
  // http://matthewlein.com/ceaser/ 在此获取贝塞尔曲线效果
  var ease = "cubic-bezier(0.000, 0.865, 0.510, 1.000)"; // zepto-fx 默认是liner

  function anim(el, speed, props, scale, callback) {
    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined

    if (scale) {
      props.scale = scale
      el.css($.fx.cssPrefix + 'transform-origin', '0 0')
    }

    return el.animate(props, speed, ease, callback)
  }

  $.fn.slideLeft = function(speed, callback){
    if (speed === undefined) speed = 0;

    this.css({
      "left" : "100%",
      "right" : "-100%",
      "opacity" : "0"
    });
    return anim(this, speed, {"left" : "0", "right" : "0", "opacity":1}, "1,1", callback)
  }

  $.fn.slideRight = function(speed, callback){
    if (speed === undefined) speed = 0;

    this.css({
      "left" : "-100%",
      "right" : "100%",
      "opacity" : "0"
    });
    return anim(this, speed, {"left" : "0", "right" : "0", "opacity":1}, "1,1", callback)
  }

  $.fn.isShow = function(){
    return this.css("display") != "none";
  }

})(Zepto)