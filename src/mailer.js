'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var nodemailer = require('nodemailer');

/**
 * `Mailer` constructor
 * @constructor
 */
 module.exports = function(config) {

  var mailer = {};

  var requiredFields = [
    'service',
    'username',
    'password'
  ];

  /**
   * Check for necessary configurations
   */
  _.each(requiredFields, function(field) {
    if (!config[field]) {
      throw new Error('Must supply Mailer with '+field);
    }
  });

  mailer.email = config.from;

  mailer.transport = {
    service: config.service,
    auth: {
      user: config.username,
      pass: config.password
    }
  };

  mailer.transporter = nodemailer.createTransport(mailer.transport);

  /**
   * Callback to be executed if error occurs
   * @param {Error} error
   * @param {Object} info
   * @returns {*}
   */
   mailer.sendMailCallback = function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  };

  /**
   * Send mail with defined transport object
   * @param {Array} to List of receivers
   * @param {String} subject Subject line
   * @param {String} text Plain text body
   * @param {String} html HTML body
   */
   mailer.sendMail = function(options) {
     mailer.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    }, this.sendMailCallback);
  };

  return mailer;

};
