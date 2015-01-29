'use strict';

/**
 * Module dependencies.
 * @type {exports}
 */
var bodyParser = require('body-parser');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var express = require('express');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var flash = require('express-flash');
var http = require('http');
var io = require('socket.io');
var lusca = require('lusca');
var methodOverride = require('method-override');
var morgan = require('morgan');
var path = require('path');
var redis = require('redis');
var RedisStore = require('connect-redis')(expressSession);
var swig = require('swig');
var util = require('util');

/**
 * Current Node environment
 * @type {String}
 * @private
 */
var env = process.env.NODE_ENV;

/**
 * Current working directory from which cthulhu is being used.
 * @type {String}
 * @private
 */
global._cwd = path.dirname(require.main.filename);

/**
 * Application dependencies
 * @type {exports}
 */
var mailer = require('./mailer');
var logger = require('./logger');

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

// Set cthulhu to base express application
var cthulhu = express();

/**
 * Cthulhu application factory
 * @param {object} config Initial configuration of application
 * @return {object} application
 */
cthulhu.configure = function(config) {

  // Store value of config in private variable
  cthulhu._config = config;

  // Set port. First check configuration or use 3000 as a fallback.
  if (!config.port) {
    throw new Error('Must supply port');
  }
  cthulhu.set('port', config.port);

  /**
   * Allow for the use of HTTP verbs such as PUT or DELETE in places
   * where the client doesn't support it.
   */
  cthulhu.use(methodOverride());

  // If config.mailer, add `nodemailer` to app
  if (config.mailer) {
    cthulhu.mailer = mailer(config.mailer);
  }

  /**
   * Add function for creating new winston logs
   * @param {string} loggerName Name of logger
   * @param {string} logFile Path to log file
   * @param {object} config Logger configuration
   * @type {Function}
   */
  cthulhu.addLogger = function(loggerName, logfile, config) {
    cthulhu.loggers = cthulhu.loggers || {};
    cthulhu.loggers[loggerName] = logger(logfile, config);
    return cthulhu;
  };


  // If config.logFile, add `winston` logger to app
  if (config.logFile) {
    cthulhu.logger = logger(config.logFile);
  }

  // Set folder for static files.
  if (config.public) {
    cthulhu.use(
      express.static(
        path.resolve(global._cwd, config.public),
        { maxAge: week } // TTL (Time To Live) for static files
      )
    );
  }

  // Set directory where views are stored.
  if (config.views) {
    cthulhu.set('views', path.resolve(global._cwd, config.views));
  }

  // Set view engine
  cthulhu.engine('html', swig.renderFile);
  cthulhu.set('view engine', 'html');

  // Set views folder
  cthulhu.set('views', path.resolve(global._cwd, config.views));

  // Disable view caching if in development
  if (env === 'development') {
    cthulhu.set('view cache', false);
    swig.setDefaults({
      cache: false,
      autoescape: false
    });
  } else {
    swig.setDefaults({
      autoescape: false
    });
  }

  // Disable view caching
  cthulhu.set('view cache', false);

  // Add `compression` for compressing responses.
  cthulhu.use(compress());

  // Add `morgan` for logging HTTP requests.
  var morganConfig = config.morgan || 'dev';

  if (cthulhu.logger) {
    cthulhu.use(morgan(morganConfig, {
      stream: {
        write: function(message, encoding) {
          return cthulhu.logger.info(message);
        }
      }
    }));
  } else {
    cthulhu.use(morgan(morganConfig));
  }

  // Add `body-parser` for parsing request body
  cthulhu.use(bodyParser.json());
  cthulhu.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Add `express-validator`
   * This module allows values in req.body to be validated with the use of
   * helper methods.
   */
  cthulhu.use(expressValidator());

  // Add cookie-parser
  cthulhu.use(cookieParser());

  // Create session store
  if (config.sessionSecret && config.sessionStore) {
    cthulhu.use(expressSession({
      // Do not save session if nothing has been modified
      resave: false,
      // Do not create session unless something is to be stored
      saveUninitialized: false,
      secret: config.sessionSecret,
      store: new RedisStore({
        host: 'localhost',
        port: 6379,
        client: redis.createClient()
      })
    }));
  }

  // Enable flash messages
  cthulhu.use(flash());

  // Enable Lusca security
  cthulhu.use(lusca(config.lusca || {
    csrf: true,
    csp: {
      default_src: "'self'",
      script_src:  "'self'",
      image_src: "'self'",
    },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true
    },
    xssProtection: true
  }));

  cthulhu.server = http.Server(cthulhu);

  return cthulhu;
};

// Start Cthulhu.
cthulhu.start = function() {
  var port = cthulhu.get('port');
  var env = cthulhu.get('env');

  // Add socket to app and begin listening.
  cthulhu.socket = io(cthulhu.server);

  // Start application server.
  cthulhu.server.listen(port, function() {
    return util.log('Cthulhu has risen at port '+port+' in '+env+' mode');
  });

  // Emit initial message
  cthulhu.socket.on('connection', function(socket) {
    return socket.emit('message', { message: 'Cthulhu has you in her grips.' });
  });

  return cthulhu;
};

/**
 * Export cthulhu
 * @type {express.Application}
 */
exports = module.exports = cthulhu;

// Export mailer
exports.Mailer = mailer;

/**
 * Export Router
 * @type {express.Router}
 */
exports.Router = express.Router;
