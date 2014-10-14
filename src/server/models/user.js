"use strict";

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/**
 * App dependencies
 */
var sentinal = require('../sentinal');

/**
 * @desc User Schema
 * @type {mongoose.Schema}
 */
var UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  accessToken: {  type: String,  unique: true, sparse: true },
  resetPasswordToken: {  type: String, unique: true, sparse: true },
  confirmAccountToken: {  type: String, unique: true, sparse: true },
  facebook: {
    id: { type: String, unique: true, sparse: true },
    token: String,
    profile: Schema.Types.Mixed
  },
  twitter: {
    id: { type: String, unique: true, sparse: true },
    token: String,
    profile: Schema.Types.Mixed
  },
  google: {
    id: { type: String, unique: true, sparse: true },
    token: String,
    profile: Schema.Types.Mixed
  },
  foursquare: {
    id: { type: String, unique: true, sparse: true },
    token: String,
    profile: Schema.Types.Mixed
  },
  github: {
    id: { type: String, unique: true, sparse: true },
    token: String,
    profile: Schema.Types.Mixed
  },
  authy: {
    id: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    country_code: { type: String, sparse: true },
    token: { type: String, unique: true, sparse: true }
  }
});

UserSchema.pre('save', function(next) {
  if (this.isNew && !this.is_connected()) {
    this.confirmAccountToken = this.makeToken();
    Cthulhu.mailer.emails.users.welcome(this);
  }
  next();
});

/**
 * @desc User methods
 * @type {mongoose.Schema.methods}
 */
UserSchema.methods = {

  /**
   * Send reset token to user
   * @return {User}
   */
  sendReset: function(callback) {
    this.resetToken = this.makeToken();
    Cthulhu.mailer.emails.users.reset(this);
    this.save(callback);
  },

  /**
   * Get user's email from their OAuth provider profile
   * @param  {String} provider Name of OAuth provider
   * @param  {Object} profile  User's profle from OAuth provider
   * @return {String} Email of user
   */
  getEmail: function(provider, profile) {
    var email;

    switch(provider) {
      case 'google':
        email = profile.emails[0].value;
        break;
      case 'facebook':
      case 'github':
      case 'foursquare':
        email = profile.email;
        break;
      default:
        email = profile.email;
        break;
    }

    return email;
  },

  /**
   * @description Check if user has provider and if the profile id matches
   * @param {String} provider Name of OAuth provider
   * @param {String|Number} id Id of user on OAuth provider
   * @returns {Boolean}
   */
  hasProvider: function(provider, id) {
    return this[provider] && (this[provider].id == id);
  },

  linkAuthy: function(authyResponse, callback) {
    this.authy.id = authyResponse.id;
    this.authy.token = authyResponse.token;
    this.save(callback);
  },  

  /**
   * @description Link user's OAuth provider account
   * @param {String} provider
   * @param {String} token
   * @param {Object} profile
   * @param {Function} callback
   * @return {User}
   * @api public
   */
  linkOAuth: function(provider, token, profile, callback) {
    if (!this.email) {
      var email = this.getEmail(provider, profile);
      this.email = email;      
    }
    this[provider].id = profile.id;
    this[provider].profile = profile;
    this[provider].token = token;
    this.save(callback);
    return this;
  },

  /**
   * @description Unlink user's Facebook account
   * @param {String} provider
   * @param {Function} callback
   * @return {User}
   * @api public
   */
  unlinkOAuth: function(provider, callback) {
    if (this[provider]) {
      this[provider] = undefined;
    }
    this.save(callback);
    return this;
  },

  /**
   * @description Return url for user's Facebook photo
   * @return {String}
   * @api public
   */
  getFacebookPhoto: function() {
    var id = this.facebook && this.facebook.profile.id;
    return 'https://graph.facebook.com/' + id + '/picture?type=large';
  },

  /**
   * @description Get user's Google+ profile photo
   * @return {String}
   * @api public
   */
  googlePhoto: function() {
    return this.google.profile.image.url.replace("sz=50", "sz=200");
  },

  /**
   * @description Get user's Twitter profile photo
   * @return {String}
   * @api public
   */
  twitterPhoto: function() {
    return this.twitter.profile.profile_image_url.replace("_normal", "");
  },

  /**
   * @description Get user's Foursquare profile first name and last name
   * @return {String}
   * @api public
   */
  foursquareName: function() {
    var profile = this.foursquare.profile;
    return profile.firstName + " " + profile.lastName;
  },

  /**
   * @description Get user's Foursquare profile photo
   * @return {String}
   * @api public
   */
  foursquarePhoto: function() {
    var profile = this.foursquare.profile;
    return profile.photo.prefix+'original'+profile.photo.suffix;
  },

  /**
   * @description Determine if user has any linked social networks
   * @return {Boolean}
   */
  is_connected: function() {
    return this.foursquare.token || 
            this.facebook.token ||
            this.google.token ||
            this.twitter.token;
  },

  /**
   * @desc Make random token
   * @return {String}
   * @api public
   */
  makeToken: function() {
    return crypto.randomBytes(32).toString('base64');
  },

  /**
   * Perform logic when account is confirmed
   * @return {User}
   */
  confirmAccount: function(callback) {
    this.confirmAccountToken = undefined;
    this.save(callback);
  },

  /**
   * Perform logic when account is confirmed
   * @return {User}
   */
  confirmReset: function(callback) {
    this.resetToken = undefined;
    this.save(callback);
  }

};

module.exports = mongoose.model('User', UserSchema);
