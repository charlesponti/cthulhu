'use strict';

var fs = require('fs');
var path = require('path');
var winston = require('winston');

/**
 * Configure logger
 * @param  {string} logfile Path to logfile
 * @return {winston.Logger}
 */
module.exports = function(logfile) {

  var logFile = path.resolve(process.cwd(), logfile);

  // If log file does not exist, create one.
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile);
  }

  winston.emitErrs = true;

  var logger = new winston.Logger({
    transports: [
    new winston.transports.File({
      level: 'info',
      filename: logFile,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
    ],
    exitOnError: false
  });

  return logger;
};
