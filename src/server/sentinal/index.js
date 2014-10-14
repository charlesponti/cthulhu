"use strict";

/**
 * Module dependencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');

/**
 * Application dependencies
 * @type {exports}
 */
var Auth = require("./auth");
var Crypt = require("./crypt");

/**
 * `Sentinal` constructor
 * @constructor
 * @public
 */
function Sentinal(config) {
  
  /**
   * @type {Auth}
   * @public
   */
  this.auth = Auth;
  
  /**
   * @type {Crypt}
   * @public
   */
  this.crypt = Crypt;

  /**
   * Check that config was passed
   */
  if (!_.isPlainObject(config)) {
    throw new Error('Must pass configuration object.');
  }

  /**
   * Attach Facebook OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Facebook)) {
    this.Facebook = require('./strategies/facebook')(config.Facebook);
  }

  /**
   * Attach Google OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Google)) {
    this.Google = require('./strategies/google')(config.Google);
  }

  /**
   * Attach Twitter OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Twitter)) {
    this.Twitter = require('./strategies/twitter')(config.Twitter);
  }

  /**
   * Attach Foursquare OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Foursquare)) {
    this.Foursquare = require('./strategies/foursquare')(config.Foursquare);
  }

  /**
   * Attach Github OAuth strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Github)) {
    this.Github = require('./strategies/github')(config.Github);
  }

  /**
   * Attach Authy strategy if configuration exists for it
   */
  if (_.isPlainObject(config.Authy)) {
    this.Authy = require('./strategies/authy')(config.Authy);
  }

  /**
   * Initialize Sentinal
   * @return {Function}
   * @public
   */
  this.initialize = function(config) {
    return function(req, res, next) {
      req.isAuthenticated = Auth.isAuthenticated;
      req.login = Auth.logIn;
      req.logout = Auth.logOut;
      next();
    };
  };

}

/**
 * Export factory function that returns new Sentinal
 * @param  {Object} config Configuration
 * @return {Sentinal}
 */
module.exports = function(config) {
  return new Sentinal(config);
};
