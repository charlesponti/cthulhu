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
 * @param  {object} routes Routes to exclude
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {Function} next
 */
exports.remember = function(routes, req, res, next) {
  if (routes.test(req.path)) {
    return next();
  }

  req.session.returnTo = req.path;
  next();
};

/**
* Attach local variables to ServerResponse
* @param {object} locals
* @param  {IncomingMessage} req
* @param  {ServerResponse} res
* @param  {Function} next
*/
exports.locals = function(locals, req, res, next) {

  if (_.isPlainObject(locals)) {
    _.extend(res.locals, locals);
  }

  /**
  * Set flash messages to response locals
  */
  res.locals.success_message = {};
  res.locals.error_message = {};

  /**
  * Add current_user(req.user) to response locals
  */
  res.locals.app_name = locals.appName || "Cthulhu";
  res.locals.current_user = req.user;
  next();
  
};
