'use strict';

/**
 * Module dependencies
 * @type {exports}
 */
var fs = require('fs');
var _ = require('lodash');

/**
 * Retrieve files in a directory
 * 
 * **Example**
 * ```js
 * var helpers = require('app/helpers');
 * 
 * // Without passing the excludes argument, this will include all 
 * // files in the `controllers` directory excluding index.js
 * var controllers = helpers.getModules('controllers');
 *
 * // When the the excludes argument is passed, this will include all 
 * // files in the `controllers` directory excluding index.js and user.js.
 * var controllers = helpers.getModules('controllers', ['user.js']);
 * 
 * ```
 * 
 * @param  {String} dirname
 * @param  {Array} excludes
 * @return {[type]}        
 */
module.exports = function(dirname, excludes) {
  var baseExclude = ['index.js'];
  excludes = excludes ? baseExclude : _.union(baseExclude, excludes);

  /*
   * Modules are automatically loaded once they are declared
   * in the controller directory.
   */
  fs.readdir(__dirname).forEach(function(file) {
    if (!_.contains(excludes, file)) {
      var moduleName = file.substr(0, file.indexOf('.'));
      exports[moduleName] = require('./' + moduleName);
    }
  });

};
