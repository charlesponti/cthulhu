'use strict';

/**
 * Module dependencies.
 * @type {exports}
 */
var util = require('util');
var http = require('http');
var path = require('path');
var lusca = require('lusca');
var io = require('socket.io');
var morgan = require('morgan');
var express = require('express');
var flash = require('express-flash');
var compress = require('compression');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var express_session = require('express-session');
var express_validator = require('express-validator');
var MongoStore = require('connect-mongo')(express_session);

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
  cthulhu.engine('html', consolidate.swig);
  cthulhu.set('view engine', 'html');

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
  cthulhu.use(express_validator());

  // Add cookie-parser
  cthulhu.use(cookieParser());

  // Create session store
  if (config.sessionSecret && config.sessionStore) {
    cthulhu.use(express_session({
      resave: true,
      saveUninitialized: true,
      secret: config.sessionSecret,
      store: new MongoStore({
        db: config.sessionStore
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

  cthulhu.server = http.createServer(cthulhu);

  return cthulhu;
};

// Start Cthulhu.
cthulhu.start = function() {
  var port = cthulhu.get('port');

  // Add socket to app and begin listening.
  cthulhu.socket = io.listen(cthulhu.server).sockets;

  // Emit initial message
  cthulhu.socket.on('connection', function(socket) {
    return socket.emit('message', { message: 'Cthulhu has you in its grips.' });
  });

  // Start application server.
  cthulhu.server.listen(port, function() {
    return util.log('Cthulhu has risen at port', port, 'in', cthulhu.get('env'), 'mode');
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
