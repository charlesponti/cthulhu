'use strict';

var fs = require('fs');
var path = require('path');
var winston = require('winston');
var mkdir = require('mkdirp');

/**
 * Configure logger
 * @param  {string} logfile Path to logfile
 * @param  {object} config Configuration for transports
 * @return {winston.Logger}
 */
module.exports = function(logConfig, config) {
  var logFile;

  mkdir(path.resolve(global._cwd, logConfig.dir), function() {
    logFile = path.resolve(global._cwd, logfile)
  })

  config = config || {};
  config.file = config.file || {};
  config.console = config.console || {};

  // If log file does not exist, create one.
  if (!fs.existsSync(logConfig.file)) {
    fs.writeFileSync(logConfig.file);
  }

  winston.emitErrs = true;

  var logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: config.file.level || 'info',
        filename: logConfig.file,
        handleExceptions: config.file.handleExceptions || true,
        json: config.file.json || true,
        maxsize: config.file.maxsize || 5242880, // 5MB
        maxFiles: config.file.level || 5,
        colorize: config.file.level || false
      }),
      new winston.transports.Console({
        level: config.console.level || 'debug',
        handleExceptions: config.true,
        json: config.json || false,
        colorize: config.colorize || true
      })
    ],
    exitOnError: false
  });

  return logger;
};
