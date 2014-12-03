'use strict';

/**
 * Module dependencies
 * @type {exports}
 */
var _ = require('lodash');
var express = require('express');

/**
 * App dependencies
 */
var sentinal = require('./sentinal');

/**
 * Controllers
 */
var AppController = require('./controllers/app');
var AuthController = require('./controllers/auth');
var ApiController = require('./controllers/api');
var UserController = require('./controllers/user');

/**
 * Create appliction router
 * @returns {Router}
 */
module.exports = function Router() {
  
  /**
   * Create new express router
   * @type {express.Router}
   */
  var $router = express.Router();

  // User
  $router.use('/account', UserController.router);

  // Log Out
  $router.post('/login', UserController.logIn);
  $router.get('/login', UserController.serve.login);
  $router.get('/logout', UserController.logOut);

  // Authentication
  $router.use('/auth', AuthController);
  $router.use('/unlink', AuthController);

  // API
  $router.get('/api/me', ApiController.getMe);

  // App Routes
  $router.use('/', AppController);

  return $router;

};
