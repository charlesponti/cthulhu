"use strict";

var crypto = require('crypto');

/**
 * `Crypt` constructor
 * @constructor
 */
var Crypt = function() {
  var self = this;

  /**
   * Bytesize.
   */
  var len = 128;

  /**
   * Iterations. ~300ms
   */
  var iterations = 12000;
  
  /**
   * @desc Make salt
   * @return {String}
   * @api public
   */
  self.makeSalt = function() {
    return crypto.randomBytes(16).toString('base64');
  };

  /**
   * Hashes a string with optional `salt`, otherwise
   * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
   * @param {String} string String to hash
   * @param {String} optional salt
   * @param {Function} callback
   * @api public
   */
  self.hash = function(string, salt, callback) {
    if (salt) {
      crypto.pbkdf2(string, salt, iterations, len, callback);
    } else {
      salt = self.makeSalt();
      crypto.pbkdf2(string, salt, iterations, len, function(err, hash) {
        if (err) {
          return callback(err);
        }
        callback(null, salt, hash);
      });
    }
  };

  /**
   * Create HMAC from text based on APP_KEY
   * @return {String}
   */
  self.makeHMAC = function(text) {
    var hmac = crypto.createHmac('sha1', process.env.APP_KEY);
    hmac.setEncoding('hex');
    hmac.write(text);
    hmac.end();
    return hmac.read();
  };
  
};

module.exports = new Crypt();
