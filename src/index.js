'use strict';

/**
 * Current Node environment
 * @type {String}
 * @private
 */
var env = process.env.NODE_ENV;

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
var middleware = require('./util/middleware');

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * `Cthulhu` constructor
 * @param {Object} config Initial configuration of application
 * @constructor
 *
 * EXAMPLE USAGE:
 * ```js
 *  var app = require('cthulhu')({
 *    port: 4000,
 *    static: '../public',
 *    views: '../app/views',
 *    sessionSecret: 'meerkatmanorrox',
 *    appName: 'Cthulhu Grand'
 *  });
 * ```
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
   * Set mailer
   */
  app.mailer = mailer(config.mailer);

  /**
   * Set folder for static files (javascript and css)
   */
  app.use(
    express.static(
      path.join(__dirname, config.static),
      { maxAge: week } // TTL (Time To Live) for static files
    )
  );

  /**
   * Set directory where views are stored.
   */
  app.set('views', path.join(__dirname, config.views));

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

  app.use(compress());
  app.use(morgan('dev'));

  /**
   * Add body-parser
   */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /**
   * Add express-validator
   */
  app.use(express_validator());

  app.use(methodOverride());

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
  app.use(express_session({
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret,
    store: new MongoStore({
      db: config.sessionStore
    })
  }));

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
   * Add CSRF (Cross-Site Request Forgery) protection
   */
  app.use(middleware.csrf);

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
