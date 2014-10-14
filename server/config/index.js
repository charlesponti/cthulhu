"use strict";

/**
 * Module dependencies
 * @type {exports}
 */
var fs = require('fs');
var path = require('path');

/**
 * Current Node environment
 * @type {String}
 */
var env = process.env.NODE_ENV;

/**
 * Get path configuraiton file. Configuration file must be named after Node 
 * environment
 * @type {String}
 */
var configPath = path.resolve(__dirname, './environments/'+env+'.json');

/**
 * Synchronously get contents of configuration file.
 * @type {Buffer}
 */
var configFile = fs.readFileSync(configPath);

/**
 * JSON.parse contents of configuration file
 * @type {Object}
 */
var config = JSON.parse(configFile);

/**
 * Attach key-values in configuration file to process.env
 */
Object.keys(config).forEach(function(key) {
  process.env[key] = config[key];
});

/**
 * Export application environment configuration
 * @type {Object}
 */
module.exports = config;
