var lazyloadHandle = false;
var trigger_range = 300;

function trigger(){
	lazyloadHandle && clearTimeout(lazyloadHandle);

	lazyloadHandle = setTimeout(function(){
		var scroll_height = document.body.scrollTop
		var screen_height = window.innerHeight

		var lazyloadImgList = $("[lazyload-src]")

		lazyloadImgList.each(function(i,img){
			var offset = $(img).offset()
			var imgTop = offset.top
			var imgHeight = offset.height

			if( imgTop < (scroll_height + screen_height + trigger_range) && (imgTop + imgHeight) > scroll_height )
			{
				if (img.tagName == "IMG") {
					$(img).attr("src",$(img).attr("lazyload-src")).removeAttr("lazyload-src");
				}
				else {
					$(img).css("background-image", "url(" + $(img).attr("lazyload-src") + ")").removeAttr("lazyload-src");
				}
			}
		})
	},200)
}


module.exports = (function(){
	trigger();

	return {
		trigger : trigger
	};
})();