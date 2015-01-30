'use strict';

var redis = require('redis');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);

module.exports = function(cthulhu, config) {

  cthulhu.use(expressSession({
    // Do not save session if nothing has been modified
    resave: false,
    // Do not create session unless something is to be stored
    saveUninitialized: false,
    secret: config.secret,
    store: new RedisStore({
      host: config.redisHost,
      port: config.redisPort,
      client: redis.createClient()
    })
  }));

  return;
};
