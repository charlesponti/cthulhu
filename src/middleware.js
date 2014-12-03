'use strict';


var _ = require('lodash');
var lusca = require('lusca');
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
* Add conditional CSRF protection. If the request is for the api,
* permissions are checked through the acess_token in req.query. If not,
* the `_csrf` token is used in req.body.
* @param  {IncomingMessage}   req
* @param  {ServerResponse}   res
* @param  {Function} next
*/
exports.csrf = function(req, res, next) {
  var access_token = req.query.access_token;
  if (/api/.test(req.originalUrl)) {
    if (access_token) {
      // TODO allow for getting user based on access token
      // User
      // .findOne({ accessToken: access_token })
      // .exec(function(err, user) {
      //   self.emitter.emit('api-user', err, user, req, res, next);
      // })
      return;
    }
    return;
  } else {
    lusca.csrf(req, res, next);
  }
};

/**
* Attach local variables to ServerResponse
* @return {Function}
*/
exports.locals = function(config) {
  /**
  * Middleware
  * @param  {IncomingMessage}   req
  * @param  {ServerResponse}   res
  * @param  {Function} next
  */
  return function(req, res, next) {
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
