'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var REST = require('restler');
var qs = require('querystring');

/**
 * `Github` constructor
 * @param {Object} options
 * @returns {Object}
 * @constructor
 */
function Github(config) {

  var self = _.extend(this, config);

  /**
   * Check for necessary configurations
   */
  _.each(['client_id','client_secret','callback_url'], function(key) {
    if (!config[key]) {
      throw new Error('Must supply Github Strategy with '+key);
    }
  });

  this.request_token_url = 'https://github.com/login/oauth/authorize?';
  this.access_token_url = 'https://github.com/login/oauth/access_token';
  this.profile_url = 'https://api.github.com/user?';

  this.authorize = function GithubAuthorize(req, res) {
    res.redirect(self.request_token_url+qs.stringify({
      client_id: self.client_id,
      scope: 'user,repo,user:email',
      redirect_uri: self.callback_url,
      state: res.locals._csrf
    }));
  };

  this.callback = function GithubAuthCallback(req, res, next) {
    REST.post(self.access_token_url, {
      query: {
        client_id: self.client_id,
        client_secret: self.client_secret,
        code: req.query.code,
        redirect_uri: self.callback_url
      }
    }).on('complete', function(data) {
      var query = qs.parse(data);
      var access_token = query.access_token;

      /**
       * Save token and profile to user
       */
      self.get_profile(access_token, function(profile) {
        req._oauth = {
          token: access_token,
          profile: profile
        };
        return next();
      });
    });
  };

  /**
   * Get user's Github profile
   * @param  {String}   access_token
   * @param  {Function} callback
   */
  this.get_profile = function GithubGetProfile(access_token, callback) {
    REST.get(self.profile_url + qs.stringify({
      access_token: access_token
    })).on('complete', callback);
  };

}

/**
 * Export a factory function that returns a new Github
 * @param  {Object} config Object containing API keys
 * @return {Github}
 */
module.exports = function(config) {
  return new Github(config);
};

