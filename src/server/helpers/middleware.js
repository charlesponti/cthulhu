'use strict';

/**
 * Module dependencies
 * @type {exports}
 */
var _ = require('lodash');
var chalk = require('chalk');
var lusca = require('lusca');
var User = require('../models/user');

function CthulhuMiddleware() {
  
  /**
   * Create reference to scope
   * @type {Object}
   */
  var self = this;

  /**
   * Add default csrf function
   * @type {Function}
   */
  self._csrf = lusca.csrf();

  /**
   * Server either the development version of the minified version of
   * the browseriy bundle based on the NODE_ENV
   * @param  {IncomingMessage}   req  
   * @param  {ServerResponse}   res
   * @param  {Function} next
   */
  this.browserify = function(req, res, next) {
    var suffix = process.env.NODE_ENV === "development" ? "dev" : "min";

    if (req.url === "/scripts/bundle.js") {
      req.url = "/scripts/bundle." + suffix + ".js";
    }

    next();
  };

  /**
   * Route middleware to set headers
   * @param  {Object}   req
   * @param  {Object}   res
   * @param  {Function} next
   */
  this.cors = function(req, res, next) {
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
   * Remember original destination before login.
   */
  this.remember = function(config) {
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
   * Log JSON stringified Object to console
   * @param  {String} name Name of object
   * @param  {Object} obj Object to log
   * @return {String}
   */
  this.logObj = function(name, obj) {
    var log = chalk.green(name) +": " +chalk.cyan(JSON.stringify(obj));
    console.log(log);
  };

  /**
   * Display information about current IncomingMessage
   * @param  {IncomingMessage}   req
   * @param  {ServerResponse}   res
   * @param  {Function} next
   */
  this.logger = function(req, res, next) {
    for (var i = 0; i < 2; i++) {
      console.log("");
    }

    console.log(chalk.red(new Date()));

    // Check for params
    if (_.size(req.params)) {
      self.logObj("Params", req.params);
    }

    // Check for data
    if (_.size(req.body)) {
      self.logObj("Body", req.body);
    }

    // Check for query
    if (_.size(req.query)) {
      self.logObj("Query", req.query);
    }

    next();
  };

  /**
   * Attach local variables to ServerResponse
   * @return {Function}
   */
  this.locals = function(config) {
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

  this.csrf = function(req, res, next) {
    var access_token = req.query.access_token;
    if (/api/.test(req.originalUrl)) {
      if (access_token) {
        User
          .findOne({ accessToken: access_token })
          .exec(function(err, user) {
            if (err) return next(err);
            if (user.accessToken == access_token) {
              req.user = user;
              return next();
            } else {
              return res.status(401).json({
                message: 'You must supply access_token'
              });
            }
          })
      } else {
        return res.status(401).json({
          message: 'You must supply access_token'
        });
      }
    } else {
      self._csrf(req, res, next);
    }
  };

}

module.exports = new CthulhuMiddleware();
