'use strict';

var path = require('path')
var swig = require('swig')

module.exports = function(cthulhu, viewsDir) {

  // Set directory where views are stored.
  if (viewsDir) {
    cthulhu.set('views', path.resolve(process.env.INIT_DIR, viewsDir));
  }

  // Set view engine
  cthulhu.engine('html', swig.renderFile);
  cthulhu.set('view engine', 'html');

  // Disable view caching if in development
  if (global._env === 'development') {
    cthulhu.set('view cache', false);
    swig.setDefaults({
      cache: false,
      autoescape: false
    });
  } else {
    swig.setDefaults({
      autoescape: false
    });
  }

  return;
}
