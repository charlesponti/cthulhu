'use strict';

var fs = require('fs');
var _ = require('lodash');

function Emails(config) {

  var self = this;

  this.mailer = config.mailer;

  this.getEmail = function(email) {
    return fs.readFileSync(__dirname+'/'+email+'.html', 'utf8');
  };

  this.users = {
    
    /**
     * Return configuration for welcome email
     * @param  {User} user
     * @return {Object}
     */
    welcome: function(user) {
      var email = self.getEmail('user/welcome');
      var mail = {
        subject: "Welcome to Cthulhu!",
        text: _.template("Welcome to Cthulhu, <%= user.email %>!")({ user: user }),
        html: _.template(email)({ user: user })
      };
      self.mailer.sendMail(user.email, mail.subject, mail.text, mail.html);
    },

    /**
     * Send email to user with reset token
     * @param  {User} user
     */
    reset: function(user) {
      var email = self.getEmail('user/reset');
      var mail = {
        subject: 'Reset Token',
        text: 'Reset Token',
        html: _.template(email)({ user: user })
      };
      self.mailer.sendMail(user.email, mail.subject, mail.text, mail.html);
    }

  };

}

module.exports = function(config) {
  return new Emails(config);
};
