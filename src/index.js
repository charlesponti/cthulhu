'use strict';

/**
 * Current Node environment
 * @type {String}
 * @private
 */
var env = process.env.NODE_ENV;

/**
 * Current working directory from which cthulhu is
 * being used.
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
var errorHandler = require('errorhandler');
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
 * Application constructor
 * @param {object} config Initial configuration of application
 * @return {object} application
 */
module.exports = function(config) {

  var app = express();

  /**
   * Store config
   */
  app._config = config;

  /**
   * Set port. First check configuration or use 3000 as a fallback.
   */
  app.set('port', config.port);

  /**
   * Allow for the use of HTTP verbs such as PUT or DELETE in places
   * where the client doesn't support it.
   */
  app.use(methodOverride());

  /**
   * If config.mailer, add `nodemailer` to app
   */
  if (config.mailer) {
    app.mailer = mailer(config.mailer);
  }

  /**
   * Add function for creating new winston logs
   * @param {string} loggerName Name of logger
   * @param {string} logFile Path to log file
   * @param {object} config Logger configuration
   * @type {Function}
   */
  app.addLogger = function(loggerName, logfile, config) {
    app.loggers = app.loggers || {};
    app.loggers[loggerName] = logger(logfile, config);
  };


  /**
   * If config.logFile, add `winston` logger to app
   */
  if (config.logFile) {
    app.logger = logger(config.logFile);
  }

  /**
   * Add express.Router to app in order for user's of cthulhu to create
   * routers without needed a dependency on express.
   * @type {express.Router}
   */
  app.Router = express.Router;

  /**
   * Set folder for static files (javascript and css)
   */
  if (config.public) {
    app.use(
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
    app.set('views', path.resolve(cwd, config.views));
  }

  /**
   * Set view engine
   */
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');

  /**
   * Disable view caching
   */
  app.set('view cache', false);
  swig.setDefaults({ cache: false });

  /**
   * Add `compression`
   * This module compresses responses.
   */
  app.use(compress());

  /**
   * Add `morgan`
   * This module is used for logging HTTP requests.
   */
  app.use(morgan('dev'));

  /**
   * Add `body-parser`
   */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Add `express-validator`
   * This module allows values in req.body to be validated
   * with the use of helper methods.
   */
  app.use(express_validator());

  /**
   * Add cookie-parser
   */
  app.use(cookieParser());

  /**
   * 500 Error Handler.
   */
  app.use(errorHandler());

  /**
   * Create session store
   */
  if (config.sessionSecret && config.sessionStore) {
    app.use(express_session({
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
  app.use(middleware.remember({
    passRoutes: [ "auth", "login","logout","signup","fonts","favicon" ]
  }));

  /**
   * Enable flash messages
   */
  app.use(flash());

  /**
   * Set up Sentianl CORS headers
   */
  app.use(middleware.cors);

  /**
   * Enable Lusca security
   */
  app.use(lusca({
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
  app.use(middleware.locals({
    appName: config.appName
  }));

  /**
   * Helper middleware to check that req is authenticated. Continue if it is
   * authenticated or redirect if it is not.
   * @param  {IncomingMessage}   req
   * @param  {ServerResponse}   res
   * @param  {Function} next
   */
  app.securePath = function(req, res, next) {
    var message = 'You must be logged in to access this resource';
    if (req.isAuthenticated()) {
      next();
    } else if (/api/.test(req.baseUrl)) {
      res.status(401).json({
        message: message
      });
    } else {
      req.flash('error', message);
      res.redirect('/');
    }
  };

  /**
   * Start Cthulhu.
   */
  app.start = function() {
    /**
     * Add socket to app and begin listening on port.
     */
    var server = http.createServer(app);
    app.socket = io.listen(server).sockets;

    /**
     * Emit initial message
     */
    app.socket.on('connection', function(socket) {
      socket.emit('message', { message: 'Cthulhu has you in its grips.' });
    });

    /**
     * Start application server.
     */
    server.listen(app.get('port'), function() {
      console.log('Cthulhu has risen at port', app.get('port'), 'in', app.get('env'), 'mode');
    });
  };

  return app;

};
