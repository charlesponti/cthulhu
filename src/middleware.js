'use strict';

var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

exports.cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers',
  'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};

/**
 * Remember the route the user was on before authentication
 * @param  {object} config
 */
exports.remember = function(config) {
  if (config.passRoutes && config.passRoutes.join) {
    var passRoutes = new RegExp(config.passRoutes.join("|"), "i");

    return function(req, res, next) {
      var path = req.path.split('/')[1];

      if (passRoutes.test(path)) {
        return next();
      }

      req.session.returnTo = req.path;
      next();
    };
  } else {
    throw new Error("Must supply passRoutes config as Array of strings");
  }
};

/**
* Attach local variables to ServerResponse
* @return {Function}
*/
exports.locals = function(config) {
  /**
   * Middleware
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   * @param  {Function} next
   */
  return function(req, res, next) {
    // Assign config to self or object literal if no config supplied
    config = config || {};

    if (_.isPlainObject(config)) {
      _.extend(res.locals, config);
    }

    /**
    * Set flash messages to response locals
    */
    res.locals.success_message = {};
    res.locals.error_message = {};

    /**
    * Add current_user(req.user) to response locals
    */
    res.locals.app_name = config.appName || "Cthulhu";
    res.locals.current_user = req.user;
    next();
  };
};
