const { graphql } = require('graphql')
const bodyParser = require('body-parser')
const express = require('express')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const http = require('http')
const io = require('socket.io')
const methodOverride = require('method-override')
const morgan = require('morgan')
const winston = require('winston')
const compression = require('compression')

/**
 * Application dependencies
 * @type {exports}
 */
const views = require('./views')
const logger = require('./logger')
const security = require('./security')
const session = require('./session')

// Set cthulhu to base express application
const cthulhu = express()

/**
  * Current Node environment
  * Set env to 'development' if none declared
  * @type {String}
  * @private
  */
const NODE_ENV = process.env.NODE_ENV || 'development'

const __PROD__ = NODE_ENV === 'production'
const __TEST__ = NODE_ENV === 'test'

/**
 * Current working directory from which cthulhu is being used.
 * @type {String}
 * @private
 */
process.env.INIT_DIR = process.cwd()

/**
 * Cthulhu application factory
 * @param {object} config Initial configuration of application
 * @return {object} application
 */
cthulhu.configure = function (config) {
  /**
   * @desc Required configuration settings
   * @type {Array}
   */
  const requiredConfigs = [
    'port'
  ]

  const { schema } = config // your GraphQL schema

  /**
   * Check for required configuration options. Throw error if any required
   * fields are missing.
   */
  requiredConfigs.forEach(function (requiredConfig) {
    if (!config[requiredConfig]) {
      throw new Error('Must supply ' + requiredConfig)
    }
  })

  // Store value of config in private variable
  cthulhu._config = config

  // Set port
  cthulhu.set('port', config.port)

  // Add `compression` for compressing responses.
  cthulhu.use(compression())

  /**
   * Allow for the use of HTTP verbs such as PUT or DELETE in places
   * where the client doesn't support it.
   */
  cthulhu.use(methodOverride())

  cthulhu.disable('x-powered-by')

  // Add `body-parser` for parsing request body
  cthulhu.use(bodyParser.json())
  cthulhu.use(bodyParser.urlencoded({ extended: true }))

  // Enable session middleware
  // PassportJS's session piggy-backs on express-session
  session(cthulhu, config.session)

  // Enable security middleware
  security(cthulhu)

  /**
   * Add `express-validator`
   * This module allows values in req.body to be validated with the use of
   * helper methods.
   */
  cthulhu.use(expressValidator())

  // Add cookie-parser
  cthulhu.use(cookieParser())

  /**
   * Add function for creating new winston logs
   * @param {string} loggerName Name of logger
   * @param {string} logFile Path to log file
   * @param {object} config Logger configuration
   * @type {Function}
   */
  cthulhu.addLogger = function (options) {
    cthulhu.loggers = cthulhu.loggers || {}
    cthulhu.loggers[options.name] = logger({
      dir: options.dir,
      file: options.file
    }, config)
    return cthulhu
  }

  // Set folder for static files.
  if (config.views) {
    views(cthulhu, config.views)
  }

  cthulhu.use(morgan(__PROD__ || __TEST__ ? 'combined' : 'dev'))

  if (config.middleware) {
    config.middleware.forEach(fn => cthulhu.use(fn))
  }

  cthulhu.post('/graphql', (req, res) => {
    graphql(schema, req.body, { user: req.user })
      .then((data) => {
        res.send(JSON.stringify(data))
      })
  })

  cthulhu.server = http.Server(cthulhu)

  return cthulhu
}

// Start Cthulhu.
cthulhu.start = function () {
  const env = cthulhu.get('env')
  const port = cthulhu.get('port')

  // Add socket to app and begin listening.
  cthulhu.socket = io(cthulhu.server)

  // Start application server.
  cthulhu.server.listen(port, function () {
    return winston.info('Cthulhu has risen at port ' + port + ' in ' + env + ' mode')
  })

  // Emit initial message
  cthulhu.socket.on('connection', function (socket) {
    return socket.emit('message', { message: 'Cthulhu has you in her grips.' })
  })

  return cthulhu
}

/**
 * Export cthulhu
 * @type {express.Application}
 */
module.exports = cthulhu
