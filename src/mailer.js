'use strict';

/**
 * Module dependencies
 */
var util = require('util');
var nodemailer = require('nodemailer');

/**
 * Factory function for constructing a mailer
 * @return {object}
 * @public
 *
 * **EXAMPLE:**
 *
 * ```js
 *   var cthulhu = require('cthulhu');
 *   var mailer = cthulhu.Mailer({
 *     service: 'gmail',
 *     username: 'foo@gmail.com',
 *     password: 'foobarbazqux'
 *   });
 * ```
 */
module.exports = function Mailer(config) {

  var mailer = {};

  var requiredFields = [
    'service',
    'username',
    'password'
  ];

  // Check for necessary configurations
  requiredFields.forEach(function(field) {
    if (!config[field]) {
      util.log('Must supply Mailer with '+field);
      throw new Error('Must supply Mailer with '+field);
    }
    return;
  });

  // Set transport to mailer which is the configuration of the service
  // being used for sending mail.
  mailer.transport = {
    service: config.service,
    auth: {
      user: config.username,
      pass: config.password
    }
  };

  // Set transporter to mailer used for sending mail
  mailer.transporter = nodemailer.createTransport(mailer.transport);

  /**
   * Callback to be executed if error occurs
   * @param {function} callback Callback to be executed after mail is sent
   * @param {Error} error
   * @param {Object} info
   * @returns {*}
   */
   mailer.sendMailCallback = function(callback, error, info) {
    if (error) {
      return util.log(error);
    }
    util.log('Message sent: ' + info.response);
    return callback();
  };

  /**
   * Send mail with defined transport object
   * @param {object} config Configuration of email
   *     @param {Array}  config.to List of receivers
   *     @param {String} config.subject Subject line
   *     @param {String} config.text Plain text body
   *     @param {String} config.html HTML body
   * @param {function} callback Callback to be executed after mail is sent
   */
   mailer.sendMail = function(config, callback) {
    return mailer.transporter.sendMail({
      from: config.from,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html
    }, mailer.sendMailCallback.bind(mailer, callback));
  };

  return mailer;

};
