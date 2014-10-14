"use strict";

/**
 * Module depenencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');
var qs = require("querystring");
var REST = require("restler");

/**
 * @param config
 * @returns {Object}
 * @constructor
 */
module.exports = function Google(config) {
  
  var self = _.extend({}, config);

  /**
   * Check for necessary elements
   */
  _.each(['client_id', 'client_secret', 'redirect_uri'], function(key) {
    if (!config[key]) {
      throw new Error("Must supply Google Strategy with "+key);
    }
  });

  self.oauth_url = "https://accounts.google.com/o/oauth2/auth?";
  self.access_token_url = "https://accounts.google.com/o/oauth2/token?";
  self.profile_url = "https://www.googleapis.com/plus/v1/people/me?";

  self.authorize = function(req, res) {
    res.redirect(self.oauth_url+qs.stringify({
      response_type: "code",
      client_id: self.client_id,
      redirect_uri: self.redirect_uri,
      scope: "email profile"
    }));
  };

  self.callback = function(req, res, next) {
    REST.post(self.access_token_url, {
      data: {
        code: req.query.code,
        client_id: self.client_id,
        client_secret: self.client_secret,
        redirect_uri: self.redirect_uri,
        grant_type: "authorization_code"
      }
    }).on("complete", function(data) {
      var access_token = data.access_token;

      self.get_profile(access_token, function(profile) {
        req._oauth = {
          token: access_token,
          profile: profile
        };
        return next();
      });
    });
  };

  self.get_profile = function(access_token, callback) {
    REST.get(self.profile_url+qs.stringify({
      access_token: access_token
    })).on("complete", callback);
  };

  return self;

};
