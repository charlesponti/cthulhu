"use strict";

/**
 * Module dependencies
 * @type {exports}
 */
var Emitter = require('events').EventEmitter;

/**
 * `Auth` constructor
 * @constructor
 * @public
 */
function Auth() {
  
  var self = this;

  self.emitter = new Emitter();

  /**
   * Check if req is authenticated
   * The scope inside of this function will be that of req.
   * @return {Boolean}
   */
  this.isAuthenticated = function() {
    return !!this.user;
  };

  /**
   * Log in user
   * The scope inside of this function will be that of req.
   * @param  {User} user
   * @param  {Object} options
   */
  this.logIn = function(user) {
    this.session.user = user.id;
  };

  /**
   * Log out user
   * The scope inside of this function will be that of req.
   * @param  {User} user
   * @param  {Object} options
   * @public
   */
  this.logOut = function() {
    delete this.session.user;
  };

  /**
   * Deserializer user
   * @param  {Function} callback
   * @return {Function}
   */
  this.deserializeUser = function(callback) {
    return function(req, res, next) {
      if (req.session && req.session.user) {
        callback(req.session.user, function(err, user) {
          self.emitter.emit('deserialized', req, res, next, err, user);
        });
      } else {
        next();
      }
    }.bind(this);
  };

  /**
   * Attach user to req when deserialized
   * @param  {http.IncomingMessage} req
   * @param  {http.ServerReponse} res
   * @param  {Function} next
   * @param  {Error} err
   * @param  {User} user
   * @public
   */
  this.emitter.on('deserialized', function(req, res, next, err, user) {
    req.user = user;
    next();
  });

}

module.exports = new Auth();
