import 'core-js/shim';

/**
 * Module dependencies.
 * @type {exports}
 */
const bodyParser = require('body-parser')
const compress = require('compression')
const cookieParser = require('cookie-parser')
const express = require('express')
const expressValidator = require('express-validator')
const http = require('http')
const io = require('socket.io')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')
const util = require('util')

/**
 * Current Node environment
 * @type {String}
 * @private
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Current working directory from which cthulhu is being used.
 * @type {String}
 * @private
 */
process.env.INIT_DIR = process.cwd();

/**
 * Application dependencies
 * @type {exports}
 */
var mailer = require('./mailer')
var logger = require('./logger')

var hour = 3600000
var day = hour * 24
var week = day * 7

// Set cthulhu to base express application
var cthulhu = express()

/**
 * Cthulhu application factory
 * @param {object} config Initial configuration of application
 * @return {object} application
 */
cthulhu.configure = function(config) {

  /**
   * @desc Required configuration settings
   * @type {Array}
   */
  var requiredConfigs = [
    'port'
  ]

  // Check for required configuration options
  requiredConfigs.forEach(function(requiredConfig) {
    if (!config[requiredConfig]) throw new Error('Must supply '+requiredConfig)
  })

  // Store value of config in private variable
  cthulhu._config = config

  // Set port
  cthulhu.set('port', config.port)

  /**
   * Allow for the use of HTTP verbs such as PUT or DELETE in places
   * where the client doesn't support it.
   */
  cthulhu.use(methodOverride())

  // If config.mailer, add `nodemailer` to cthulhu
  if (config.mailer) {
    cthulhu.mailer = mailer(config.mailer)
  }

  /**
   * Add function for creating new winston logs
   * @param {string} loggerName Name of logger
   * @param {string} logFile Path to log file
   * @param {object} config Logger configuration
   * @type {Function}
   */
  cthulhu.addLogger = function(options) {
    cthulhu.loggers = cthulhu.loggers || {}
    cthulhu.loggers[options.name] = logger({
      dir: options.dir, 
      file: options.file
    }, config)
    return cthulhu
  }

  // If config.log, add `winston` logger to app
  if (config.log && config.log.file) {
    cthulhu.logger = logger(config.log)
  }

  // Set folder for static files.
  if (config.public) {
    cthulhu.use(
      express.static(
        path.resolve(process.env.INIT_DIR, config.public),
        { maxAge: week } // TTL (Time To Live) for static files
      )
    )
  }

  // Configure views
  require('./views')(cthulhu, config.views)

  // Disable view caching
  cthulhu.set('view cache', false)

  // Add `compression` for compressing responses.
  cthulhu.use(compress())

  // Add `morgan` for logging HTTP requests.
  var morganConfig = config.morgan || 'dev'

  if (cthulhu.logger) {
    cthulhu.use(morgan(morganConfig, {
      stream: {
        write: function(message) {
          return cthulhu.logger.info(message)
        }
      }
    }))
  } else {
    cthulhu.use(morgan(morganConfig))
  }

  // Add `body-parser` for parsing request body
  cthulhu.use(bodyParser.json())
  cthulhu.use(bodyParser.urlencoded({ extended: true }))

  /**
   * Add `express-validator`
   * This module allows values in req.body to be validated with the use of
   * helper methods.
   */
  cthulhu.use(expressValidator())

  // Add cookie-parser
  cthulhu.use(cookieParser())

  if (config.sessionSecret) {
    // Enable session middleware
    cthulhu.use(require('./session')(cthulhu, config.session))
    // Enable security middleware
    cthulhu.use(require('./security')(cthulhu, config.lusca))
  }

  cthulhu.server = http.Server(cthulhu)

  if (config.middleware) {
    config.middleware.forEach(function(fn) {
      cthulhu.use(fn);
    });
  }

  return cthulhu
}

// Start Cthulhu.
cthulhu.start = function() {
  var env = cthulhu.get('env');
  var port = cthulhu.get('port');

  // Add socket to app and begin listening.
  cthulhu.socket = io(cthulhu.server)

  // Start application server.
  cthulhu.server.listen(port, function() {
    return util.log('Cthulhu has risen at port '+port+' in '+env+' mode')
  })

  // Emit initial message
  cthulhu.socket.on('connection', function(socket) {
    return socket.emit('message', { message: 'Cthulhu has you in her grips.' })
  })

  return cthulhu
}

/**
 * Export cthulhu
 * @type {express.Application}
 */
exports = module.exports = cthulhu

// Export mailer
exports.Mailer = mailer

/**
 * Export Router
 * @type {express.Router}
 */
exports.Router = express.Router
