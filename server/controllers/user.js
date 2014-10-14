'use strict';

/**
 * Module dependencies
 * @type {exports}
 * @private
 */
var _ = require('lodash');
var express = require('express');
var Emitter = require('events').EventEmitter;

/**
 * Application dependencies
 * @type {exports}
 * @private
 */
var User = require('../models/user');
var sentinal = require('../sentinal');

/**
 * `UserController` constructor
 * @constructor
 * @public
 */
function UserController() {
  
  this.emitter = new Emitter();
  
  /**
   * Reference to this
   * @type {Object}
   * @private
   */
  var self = this;

  /**
   * Sign up user through two-factor authentication
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   */
  this.logIn = function(req, res, next) {
    User.findOne({ email: req.body.email }).exec(function(err, user) {
      
      if (err) {
        req.flash('error', 'There was an unexpected server error.');
        return res.redirect('/login');
      }

      if (user) {
        return user.sendReset(function(err) {
          self.emitter.emit('send-reset', err, user, req, res);  
        });
      }
      
      user = new User({ email: req.body.email });
      user.save(function(err, user) {
        if (err) {
          console.log(err);
          req.flash('error', 'There was an unexpected server error.');
          return res.redirect('/login');
        }
        req.flash('success', 'You will recieve an email shortly to confirm your account');
        res.redirect('/login');
      });
    });
  };

  /**
   * Serve templates
   * @type {Object}
   */
  this.serve = {
    /**
     * Serve sign up page
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {Function} next
     */
    login: function serveLogin(req, res) {
      if (req.isAuthenticated()) {
        return res.redirect('/account');
      }
      return res.render('users/login');
    },
    /**
     * Serve account page if req is authenticated
     * @param  {IncomingMessage} req
     * @param  {ServerResponse} res
     * @param  {Function} next
     */
    account: function serveAccount(req, res, next) {
      if (req.isAuthenticated()) {
        return res.render('users/account');
      }
      req.flash('error', 'You must be logged in to access your account.');
      res.redirect('/login');
    }
  };

  /**
   * Log out user
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   */
  this.logOut = function(req, res, next) {
    req.logout();
    res.redirect("/");
  };

  /**
   * Link Facebook account
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   */
  this.linkFacebook = function(req, res, next) {
    if (!req.user) {
      return User
        .findOne({ email: req._oauth.profile.email })
        .exec(function(err, user) {
          self.emitter.emit('link-oauth', err, user, 'facebook', req, res);
        });
    }
    return self.emitter.emit('link-oauth', null, req.user, 'facebook', req, res);
  };

  /**
   * Link Google account
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   */
  this.linkGoogle = function(req, res, next) {
    if (!req.user) {
      return User
        .findOne({ email: req._oauth.profile.emails[0].value })
        .exec(function(err, user) {
          self.emitter.emit('link-oauth', err, user, 'google', req, res);
        });
    }
    return self.emitter.emit('link-oauth', null, req.user, 'google', req, res);
  };

  /**
   Link Twitter account
   @param {string} token Twitter access token
   @param {string} secret Twitter token secret
   @param {object} profile Twitter profile
   @param {IncomingMessage} req
   @param {ServerResponse} res
   */
  this.linkTwitter = function(req, res, next) {
    if (!req.user) {
      return User
        .findOne({ email: req._oauth.profile.email })
        .exec(function(err, user) {
          self.emitter.emit('link-oauth', err, user, 'twitter', req, res);
        });
    }
    return self.emitter.emit('link-oauth', null, req.user, 'twitter', req, res);
  };

  /**
   * Link Foursquare account
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   */
  this.linkFoursquare = function(req, res, next) {
    if (!req.user) {
      User
        .findOne({ email: req._oauth.profile.email })
        .exec(function(err, user) {
          self.emitter.emit('link-oauth', err, user, 'foursquare', req, res);
        });
    }
    return self.emitter.emit('link-oauth', null, req.user, 'foursquare', req, res);
  };

  /**
   * Link Github account
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   */
  this.linkGithub = function(req, res, next) {
    if (!req.user) {
      return User
        .findOne({ email: req._oauth.profile.email })
        .exec(function(err, user) {
          self.emitter.emit('link-oauth', err, user, 'github', req, res);
        });
    }
    return self.emitter.emit('link-oauth', null, req.user, 'github', req, res);
  };

  /**
   * Unlink OAuth provider from user
   * @param {String} provider
   * @returns {Function}
   */
  this.unlinkOAuth = function(provider, req, res, next) {
    req.user.unlinkOAuth(provider, function(err, user) {
      self.emit('unlink-oauth', err, user, provider, res, res);
    });
  };

  /**
   * Delete user
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @param {Function} next
   */
  this.deleteAccount = function deleteAccount(req, res, next) {
    User.remove({ _id: req.user.id }).exec(function(err) {
      self.emitter.emit('account-delete', self, req, res);
    });
  };

  /**
   * Confirm account with token
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @param {Function} next
   */
  this.confirmAccount = function confirmAccount(req, res, next) {
    User
      .findOne({ confirmAccountToken: req.params.token })
      .exec(function(err, user) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/login');
        }

        if (!user) {
          req.flash('error', 'The token you provided is incorrect');
          return res.redirect('/login');
        }

        user.confirmAccount(function(err) {
          self.emitter.emit('account-confirm', err, user, req, res);
        });
      });
  };

  /**
   * Confirm account with token
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @param {Function} next
   */
  this.confirmReset = function confirmReset(req, res, next) {
    User
      .findOne({ resetToken: req.params.token })
      .exec(function(err, user) {
        if (err) {
          req.flash('error', 'There was an unexpected server error.');
          return res.redirect('/login');
        }

        if (!user) {
          req.flash('error', 'The token you provided is incorrect');
          return res.redirect('/login');
        }

        user.confirmReset(function(err) {
          self.emitter.emit('confirm-reset', err, user, req, res);
        });
      });
  };

  /**
   * Reset account with token
   * @param {Error} err
   * @param {User|null} user
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  this.emitter.on('confirm-reset', function(err, user, req, res) {
    if (err) {
      req.flash('error', 'There was an error deleting your account.');
      return res.redirect('/login');
    }
    req.login(user);
    req.flash('success', 'Logged in.');
    return res.redirect('/account');
  });

  /**
   * Redirect back to login after reset token is sent to user
   * @param  {Error} err
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   */
  this.emitter.on('send-reset', function sendReset(err, user, req, res) {
    if (err) {
      req.flash('error', 'There was an error deleting your account.');
      return res.redirect('/login');
    }
    req.flash('success', 'You will receive a new login link at '+user.email+'.');
    return res.redirect('/login');
  });

  /**
   * Finish request after account is deleted
   * @param  {Error|null} err
   * @param  {http.IncomingMessage} req
   * @param  {http.ServerResponse} res
   */
  this.emitter.on('account-delete', function onDeleteAccount(err, req, res) {
    if (err) {
      req.flash('error', 'There was an error deleting your account.');
      return res.redirect('/account');
    }
    req.logout();
    req.flash("success", "Your account has been deleted.");
    return res.redirect('/');
  });

  /**
   * Confirm account with token
   * @param {Error} err
   * @param {User|null} user
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  this.emitter.on('account-confirm', function onConfirmAccount(err, user, req, res) {
    if (err) {
      req.flash('error', 'There was an error confirming your account');
      return res.redirect('/login');
    }
    req.login(user);
    req.flash('success', 'Account confirmed');
    return res.redirect('/account');
  });

  /**
   * Callback for linking Oauth
   * @param {Error|null} err
   * @param {User|null} user
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  this.emitter.on('oauth-linked', function onLinkOAuth(err, user, req, res) {
    if (err) {
      req.flash("error", err.message);
      return res.status(500).redirect(req.user ? '/account' : '/login');
    }
    
    // Login user if no user logged in
    if (!req.user) {
      req.login(user);
    }

    req.flash("success", "Account linked.");
    return res.redirect("/account");
  });

  /**
   * Callback used after User table is queried for user's with specified
   * email
   * @param  {Error|null} err
   * @param  {User|null} user
   * @param  {String} provider
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   * @return {Function}
   */
  this.emitter.on('link-oauth', function(err, user, provider, req, res) {
    if (err) {
      req.flash('error', 'There was an unexpected server error.');
      return res.status(500).redirect(req.user ? '/account' : '/login');
    }

    var oauth = req._oauth;

    user = user || req.user || new User();
    
    return user.linkOAuth(provider, oauth.token, oauth.profile, function(err, user) {
      self.emitter.emit('oauth-linked', err, user, req, res);
    });
  });

  /**
   * Callback to be called after OAuth provider is unlinked
   * @param {String} provider
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Error} err
   * @returns {Function}
   */
  this.emitter.on('unlink-oauth', function(err, user, provider, req, res) {
    if (err) {
      req.flash("error", provider+" account could not be unlinked.");
      return res.redirect("/account");
    } 
    req.flash("success", provider+" account unlinked!");
    return res.redirect("/account");
  });
  
  /**
   * Finish request after local authentication has finished
   * @param  {Error} err
   * @param  {User} user
   * @param  {IncomingMessage} req
   * @param  {ServerResponse} res
   */
  this.emitter.on('account-create', function(err, user, req, res) {
    if (err) {
      req.flash("error", "There was an error. Our developers are looking into it");
      return res.redirect("/login");
    }
    req.login(user);
    req.flash("success", "Account created.");
    res.redirect("/account");
  });

  /**
   * Log in user
   * @param  {User} user
   * @param  {http.IncomingMessage} req
   * @param  {http.ServerResponse} res
   */
  this.emitter.on('login', function(user, req, res) {
    req.login(user);
    req.flash("success", "Logged In.");
    res.redirect("/account");
  });

  /**
   * Create router
   */
  var router = express.Router();

  /**
   * Routes
   */
  router.get('/', this.serve.account);
  router.get('/reset/:token', this.confirmReset);
  router.get('/confirm/:token', this.confirmAccount);
  router.get('/delete', this.deleteAccount);
  
  this.router = router;
  
}

module.exports = new UserController();
