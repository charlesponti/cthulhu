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
var http = require('http');
var swig = require('swig');
var path = require('path');
var nconf = require('nconf');
var chalk = require('chalk');
var lusca = require('lusca');
var io = require('socket.io');
var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
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
var User = require('./models/user');
var sentinal = require('./sentinal');
var middleware = require('./helpers/middleware');

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
function Cthulhu(config) {

  var app = express();

  /**
   * Store config
   */
  app._config = config;

  /**
   * Set sentinal
   * @type {[type]}
   */
  this.sentinal =
  app.sentinal = sentinal(config.OAuth);

  /**
   * Set port. First check configuration or use 3000 as a fallback.
   */
  app.set('port', config.port || 4000);

  /**
   * Set mailer
   */
  this.mailer = 
  app.mailer = mailer(config.Mailer);

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
  app.set('views', path.join(__dirname, config.views || './views'));
  
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
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express_validator());
  app.use(methodOverride());
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
   * Set command line logging
   */
  app.use(middleware.logger);

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
   * Serve either dev or min version of javascript depending on
   * environment.
   */
  app.use(middleware.browserify);

  /**
   * Set up Sentinal
   */
  app.use(app.sentinal.initialize(config.oauth));

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

  app.use(app.sentinal.auth.deserializeUser(function(id, done) {
    User.findOne({ _id: id }).exec(function(err, user) {
      /**
       * If err, pass new Error
       */
      if (err) {
        return done(err);
      }

      /**
       * If no user exists, pass new Error with message
       */
      if (!user) {
        return done(new Error("Invalid id."));
      }

      return done(null, user);
    });
  }));

  /**
   * Set local variables for use in views
   */
  app.use(middleware.locals({
    appName: config.appName
  }));

  /**
   * Connect to database
   */
  app.startDB = function() {
    var db = config.DB;
    mongoose.connect(db, function(err) {
      if (err) {
        return console.log(err);
      } 
      app.db = mongoose.connection;
      console.log('Connected to '+chalk.red.bold(db)+' database.');
    });
  };

  /**
   * Extend this with new Express application
   */
  _.extend(this, app);


  /**
   * Start Cthulhu.
   */
  this.start = function() {
    /**
     * Add socket to app and begin listening on port.
     */
    var server = http.createServer(app);
    app.socket = io.listen(server).sockets;

    /**
     * Connect to database
     */
    app.startDB();

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
      console.log(chalk.blue.bold('Cthulhu'), 
        'has risen at port ' + chalk.blue.bold(app.get('port')) + ' in',
        chalk.red.bold(app.get('env'))
      );
    });
  };

}

/**
 * Export factory that returns new Cthulhu
 * @param  {Object} config
 * @return {Cthulhu}
 */
module.exports = function() {
  /**
   * Get application configuration
   * @type {Object}
   */
  var config = require('./config');

  /**
   * Check if there is a current instance of Cthulhu. If so, return that 
   * instance. If not, create new Cthulhu, attach to GLOBAL, and return it..
   */
  if (!Cthulhu._instance) {
    GLOBAL.Cthulhu =
    Cthulhu._instance = new Cthulhu(config);

    /**
     * Setup Cthulhu routes
     */
    var router = require('./routes');
    Cthulhu._instance.use(router());
  }

  return Cthulhu._instance;
};