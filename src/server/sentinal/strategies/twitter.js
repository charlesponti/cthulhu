"use strict";

/**
 * Module dependencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');
var oauth = require("oauth");

module.exports = function Twitter(options) {

  var self = _.extend({}, options);
  
  /**
   * Check for necessary configurations
   */
  _.each(['consumer_secret','consumer_key','callback_url'], function(key) {
    if (!options[key]) {
      throw new Error("Must supply Twitter Strategy with "+key);
    }
  });

  self.request_token_url = "https://twitter.com/oauth/request_token";
  self.access_token_url = "https://twitter.com/oauth/access_token";
  self.profile_url = "https://api.twitter.com/1.1/account/verify_credentials.json";
  self.authorize_url = "https://twitter.com/oauth/authorize?oauth_token=";
  
  /**
   * Twitter OAuth consumer
   * @type {oauth.OAuth}
   */
  self.consumer = new oauth.OAuth(
    self.request_token_url,
    self.access_token_url,
    self.consumer_key,
    self.consumer_secret,
    "1.0A",
    self.callback_url,
    "HMAC-SHA1"
  );

  self.authorize = function(req, res) {
    self.consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
      if (error) {
        req.flash("error", "Error getting Twitter request token.");
        res.redirect("/account");
      } else {
        self.oauthRequestToken = oauthToken;
        self.oauthRequestTokenSecret = oauthTokenSecret;
        res.redirect(self.authorize_url+self.oauthRequestToken);
      }
    });
  };

  self.callback = function(req, res, next) {
    self.consumer.getOAuthAccessToken(
      self.oauthRequestToken,
      self.oauthRequestTokenSecret,
      req.query.oauth_verifier,
      function(error, access_token, secret) {
        if (error) {
          req.flash("error", "Error getting Twitter access token.");
          return res.redirect("/account");
        }
        /**
         * Clear req.session oauth values
         */
        delete self.oauthRequestToken;
        delete self.oauthRequestTokenSecret;

        /**
         * Save token and tokenSecret to user
         */
        self.get_profile(access_token, secret, function (err, profile) {
          req._oauth = {
            token: access_token,
            secret: secret,
            profile: profile
          };
          return next();
        });
      }
    );
  };

  self.get_profile = function(access_token, secret, callback) {
    self.consumer.get(self.profile_url, access_token, secret, function(err, data) {
      callback(err, JSON.parse(data));
    });
  };

  return self;

};
