'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');
var nodemailer = require('nodemailer');

/**
 * Application dependencies
 * @type {exports}
 */

/**
 * `Mailer` constructor
 * @constructor
 */
function Mailer(options) {

  var self = this;

  var requiredFields = [
    'service',
    'service_username',
    'service_password',
    'from_email'
  ];

  /**
   * Check for necessary configurations
   */
  _.each(requiredFields, function(field) {
    if (!options[field]) {
      throw new Error('Must supply Mailer with '+field);
    }
  });

  this.email = options.from_email;

  this.transport = {
    service: options.service,
    auth: {
      user: options.service_username,
      pass: options.service_password
    }
  };

  this.transporter = nodemailer.createTransport(this.transport);

  /**
   * Callback to be executed if error occurs
   * @param {Error} error
   * @param {Object} info
   * @returns {*}
   */
  this.sendMailCallback = function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  };

  /**
   * Send mail with defined transport object
   * @param {Array} email List of receivers
   * @param {String} subject Subject line
   * @param {String} text Plain text body
   * @param {String} html HTML body
   */
  this.sendMail = function(email, subject, text, html) {
    this.transporter.sendMail({
      from: this.transport.auth.user,
      to: email,
      subject: subject,
      text: text,
      html: html
    }, this.sendMailCallback);
  };

  this.emails = require('./emails')({ mailer: this });
  
}

/**
 * Export factory function that returns new Mailer
 * @param  {Object} config
 * @return {Mailer}
 */
module.exports = function(config) { 
  return new Mailer(config); 
};
