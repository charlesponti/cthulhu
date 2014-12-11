'use strict';

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
var cwd = process.cwd();

/**
 * Module dependencies.
 * @type {exports}
 */
var _ = require('lodash');
var util = require('util');
var http = require('http');
var swig = require('swig');
var path = require('path');
var lusca = require('lusca');
var io = require('socket.io');
var morgan = require('morgan');
var express = require('express');
var flash = require('express-flash');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var express_session = require('express-session');
var express_validator = require('express-validator');
var MongoStore = require('connect-mongo')(express_session);

/**
 * Application dependencies
 * @type {exports}
 */
var mailer = require('./mailer');
var logger = require('./logger');
var middleware = require('./middleware');

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * Cthulhu application factory
 * @param {object} config Initial configuration of application
 * @return {object} application
 */
exports = module.exports = function(config) {

  // Set cthulhu to base express application
  var cthulhu = express();

  // Store value of config in private variable
  cthulhu._config = config;

  // Set port. First check configuration or use 3000 as a fallback.
  cthulhu.set('port', config.port);

  /**
   * Allow for the use of HTTP verbs such as PUT or DELETE in places
   * where the client doesn't support it.
   */
  cthulhu.use(methodOverride());

  /**
   * If config.mailer, add `nodemailer` to app
   */
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
  };


  /**
   * If config.logFile, add `winston` logger to app
   */
  if (config.logFile) {
    cthulhu.logger = logger(config.logFile);
  }

  /**
   * Set folder for static files (javascript and css)
   */
  if (config.public) {
    cthulhu.use(
      express.static(
        path.resolve(cwd, config.public),
        { maxAge: week } // TTL (Time To Live) for static files
      )
    );
  }

  /**
   * Set directory where views are stored.
   */
  if (config.views) {
    cthulhu.set('views', path.resolve(cwd, config.views));
  }

  /**
   * Set view engine
   */
  cthulhu.engine('html', swig.renderFile);
  cthulhu.set('view engine', 'html');

  /**
   * Disable view caching
   */
  cthulhu.set('view cache', false);
  swig.setDefaults({ cache: false });

  /**
   * Add `compression`
   * This module compresses responses.
   */
  cthulhu.use(compress());

  /**
   * Add `morgan`
   * This module is used for logging HTTP requests.
   */
   var morganConfig = config.morgan || 'dev';

   if (cthulhu.logger) {
    cthulhu.use(morgan(morganConfig, {
      stream: {
        write: function(message, encoding) {
          cthulhu.logger.info(message);
        }
      }
    }));
  } else {
    cthulhu.use(morgan(morganConfig));
  }

  /**
   * Add `body-parser`
   */
  cthulhu.use(bodyParser.json());
  cthulhu.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Add `express-validator`
   * This module allows values in req.body to be validated
   * with the use of helper methods.
   */
  cthulhu.use(express_validator());

  /**
   * Add cookie-parser
   */
  cthulhu.use(cookieParser());

  /**
   * Create session store
   */
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

  /**
   * Remember original destination before login.
   */
  var passRoutes = config.passRoutes || [];
  cthulhu.use(middleware.remember.bind(cthulhu, new RegExp(passRoutes.join("|"), "i")));

  /**
   * Enable flash messages
   */
  cthulhu.use(flash());

  /**
   * Set up Sentianl CORS headers
   */
  cthulhu.use(middleware.cors);

  /**
   * Enable Lusca security
   */
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

  /**
   * Set local variables for use in views
   */
  cthulhu.use(middleware.locals.bind(cthulhu, config.locals || {}));

  /**
   * Start Cthulhu.
   */
  cthulhu.start = function() {
    /**
     * Add socket to app and begin listening on port.
     */
    var server = http.createServer(cthulhu);
    cthulhu.socket = io.listen(server).sockets;

    /**
     * Emit initial message
     */
    cthulhu.socket.on('connection', function(socket) {
      socket.emit('message', { message: 'Cthulhu has you in its grips.' });
    });

    /**
     * Start application server.
     */
    server.listen(cthulhu.get('port'), function() {
      console.log('Cthulhu has risen at port', cthulhu.get('port'), 'in', cthulhu.get('env'), 'mode');
    });
  };

  return cthulhu;

};

/**
 * Export mailer
 * @type {[type]}
 */
exports.Mailer = mailer;

/**
 * Export Router
 * @type {express.Router}
 */
exports.Router = express.Router;
