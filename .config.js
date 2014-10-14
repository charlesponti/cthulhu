"use strict";

/**
 * Module dependencies
 * @type {exports}
 */
var dotenv = require('dotenv');

/**
 * Set path of .env and load env variables
 */
var dotEnvFile = './server/env/.env.'+process.env.NODE_ENV;
dotenv._getKeysAndValuesFromEnvFilePath(dotEnvFile);
dotenv._setEnvs();

module.exports = {

  port: process.env.PORT || 4000,

  appName: "Cthulhu",

  session_ttl: process.env.SESSION_TTL,

  sessionSecret: process.env.SESSION_SECRET,

  static: '../public',

  views: './views',

  baseUrl: process.env.BASE_URL,

  social: {
    useFacebook: true,
    useTwitter: true,
    useGoogle: true,
    useFoursquare: true
  },

  oauth: {
    Facebook: {
      app_id: process.env.FACEBOOK_APP_ID,
      app_secret: process.env.FACEBOOK_APP_SECRET,
      callback_url: process.env.FACEBOOK_CALLBACK
    },
    Twitter: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      callback_url: process.env.TWITTER_CALLBACK
    },
    Google: {
      realm: process.env.GOOGLE_REALM,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK
    },
    Foursquare: {
      client_id: process.env.FOURSQUARE_CLIENT_ID,
      client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
      callback_url: process.env.FOURSQUARE_CALLBACK
    },
    Github: {
      client_id: process.env.GITHUB_APP_ID,
      client_secret: process.env.GITHUB_APP_SECRET,
      callback_url: process.env.GITHUB_CALLBACK
    },
    Authy: {
      api_key: process.env.AUTHY_API_KEY,
      sandbox_api_key: process.env.AUTHY_SANDBOX_API_KEY
    }
  },
    
  db: {
    test: 'mongodb://localhost/cthulhu-test',
    development: 'mongodb://localhost/cthulhu-dev',
    production: 'mongodb://localhost/cthulhu-prod',
    session_store: 'cthulhu-session'
  },

  mailer: {
    email: process.env.MAILER_EMAIL,
    service: process.env.MAILER_SERVICE,
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD
  }

};
