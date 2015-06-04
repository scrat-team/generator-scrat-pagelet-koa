'use strict';

/**
 * Loads the given css string into the document head as an inlined script.
 *
 * @name loadCSS
 * @function
 * @param css {String} the css to load
 */
module.exports = function loadCSS(css) {
  css = '\n' + css + '\n';

  var head  =  document.getElementsByTagName('head')[0];
  var style =  document.createElement('style');

  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
};