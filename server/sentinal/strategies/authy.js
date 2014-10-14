'use strict';

/**
 * Grab api keys from environment
 * @type {String}
 */
var env = process.env.NODE_ENV;

/**
 * Module dependencies
 * @type {exports}
 */
var _ = require('lodash');
var restler = require('restler');

/**
 * `Authy` constructor
 * @param {Objedt} config
 * @param {String} config.api_key Production API key
 * @param {String} config.sandbox_api_key Sandbox API key
 * @constructor
 */
function Authy(config) {
  var apiKey = config.api_key;
  var sandboxApiKey = config.sandbox_api_key;

  /**
   * Check for Production API key
   */
  if (!_.isString(apiKey)) {
    throw Error('Must supply Authy Production API Key');
  }

  /**
   * Check for Sandbox API key
   */
  if (!_.isString(sandboxApiKey)) {
    throw Error('Must supply Authy Sandbox API Key');
  }

  /**
   * Authy production api url
   * @type {String}
   */
  this.productionUrl = 'https://api.authy.com';

  /**
   * Authy sandbox api url
   * @type {String}
   */
  this.sandboxUrl = 'http://sandbox-api.authy.com';

  /**
   * Authy application production api key
   * @type {String}
   */
  this.productionApiKey = apiKey;

  /**
   * Authy application sandbox api key
   * @type {String}
   */
  this.sandboxApiKey = sandboxApiKey;

  /**
   * Set url and key based on Node environment
   */
  switch(process.env.NODE_ENV) {
    /**
     * Set url and key for development environment
     */
    case 'development':
      this.url = this.sandboxUrl;
      this.key = this.sandboxApiKey;
      break;
    /**
     * Set url and key for production environment
     */
    case 'production':
      this.url = this.productionApiUrl;
      this.key = this.productionApiKey;
      break;
  }

  this.query = { api_key: this.key };

}

/**
 * Register new user
 * POST {Authy API}/protected/{FORMAT}/users/new?api_key={KEY}
 * @param  {String}   email        User's email address
 * @param  {String}   cellphone    User's cellphone number
 * @param  {String}   country_code User's phone country code
 * @param  {Function} callback
 * @public
 */
Authy.prototype.register = function authyRegister(email, cellphone, country_code, callback) {

  restler.post(this.url+'/protected/json/users/new', {
    data: {
      user: {
        email: email,
        cellphone: cellphone,
        country_code: country_code
      }
    },
    query: this.query
  }).on('success', function(result, response) {
    callback(null, result);
  }).on('fail', function(result, response) {
    callback(result);
  });

};

/**
 * Send user an SMS with token
 * GET {Authy API}/protected/{FORMAT}/sms/{AUTHY_ID}?api_key={KEY}
 * @param {String} id User's Authy ID
 * @param {Function} callback
 */
Authy.prototype.smsRegister = function authySmsRegister(id, force, callback) {
  var url = this.url+'/protected/json/sms/'+id;
  var query = Object.create(this.query);

  if (_.isBoolean(force) && force) {
    query.force = true;
  } else {
    callback = force;
  }

  return restler.get(url, {
    query: query
  }).on('success', function(result, response) {
    callback(null, result);
  }).on('fail', function(result, response) {
    callback(result);
  });
};

/**
 * Verify Authy token
 * GET {Authy API}/protected/json/verify/{TOKEN}/{ID}?api_key={API_KEY}
 * @param  {String}   token
 * @param  {String}   id
 * @param  {Function} callback
 */
Authy.prototype.verify = function authyVerify(token, id, callback) {
  var url = this.url+'/protected/json/verify/'+token+'/'+id;

  return restler.get(url, {
    query: this.query
  }).on('success', function(result, response) {
    callback(null, result);
  }).on('fail', function(result, response) {
    callback(result);
  });
};

/**
 * Export factory that returns a new Authy
 * @param {Objedt} config
 * @param {String} config.api_key Production API key
 * @param {String} config.sandbox_api_key Sandbox API key
 * @return {Authy}
 */
module.exports = function(config) {
    return new Authy(config);
};
