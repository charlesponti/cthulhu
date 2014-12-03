"use strict";

/**
 * Module dependencies
 * @type {exports}
 * @api private
 */
var _ = require('lodash');
var oauth = require('oauth');
var REST = require('restler');
var qs = require("querystring");

/**
 *
 * @param {Object} options
 * @returns {Object}
 * @constructor
 */
module.exports = function Foursquare(options) {

  var self = _.extend({}, options);

  /**
   * Check for necessary elements
   */
  _.each(['client_id', 'client_secret', 'callback_url'], function(key) {
    if (!options[key]) {
      throw new Error("Must supply Foursquare Strategy with "+key);
    }
  });

  self.request_token_url = "https://foursquare.com/oauth2/authenticate?";
  self.access_token_url = "https://foursquare.com/oauth2/access_token";
  self.profile_url = "https://api.foursquare.com/v2/users/self?";

  self.consumer = new oauth.OAuth2(
    self.client_id,
    self.client_secret,
    "https://foursquare.com/oauth2/",
    "authenticate",
    "access_token",
    null
  );

  self.authorize = function(req, res) {
    res.redirect(self.request_token_url+qs.stringify({
      response_type: "code",
      client_id: self.client_id,
      redirect_uri: self.callback_url
    }));
  };

  self.callback = function(req, res, next) {
    self.consumer.getOAuthAccessToken(
      req.query.code,
      {
        redirect_uri: self.callback_url,
        grant_type:'authorization_code'
      },
      function(e, access_token, refresh_token, results) {
        if (e) {
          req.flash("error", "Error getting Foursquare access token.");
          res.redirect("/account");
        } else {
          /**
           * Save token and profile to user
           */
          self.get_profile(access_token, function(data) {
            var profile = data.response.user;

            req._oauth = {
              token: access_token,
              profile: profile
            };

            return next();
          });
        }
      }
    );
  };

  self.get_profile = function(access_token, callback) {
    if (access_token) {
      REST.get(self.profile_url+qs.stringify({
        oauth_token: access_token,
        v: "20140806"
      })).on("complete", callback);
    }
  };

  return self;
};
