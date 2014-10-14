'use strict';

/**
 * Module dependencies
 * @type {exports}
 */
var express = require('express');

/**
 * Application dependencies
 * @type {exports}
 */
var sentinal = Cthulhu.sentinal;
var UserController = require('./user');

/**
 * Create Express router
 * @type {express.Router}
 */
var router = express.Router();

router.get('/facebook', sentinal.Facebook.authorize);

router.get('/facebook/callback', sentinal.Facebook.callback, UserController.linkFacebook);

router.get('/google', sentinal.Google.authorize);

router.get('/google/callback', sentinal.Google.callback, UserController.linkGoogle);

router.get('/twitter', sentinal.Twitter.authorize);

router.get('/twitter/callback', sentinal.Twitter.callback, UserController.linkTwitter);

router.get('/foursquare', sentinal.Foursquare.authorize);

router.get('/foursquare/callback', sentinal.Foursquare.callback, UserController.linkFoursquare);

router.get('/github', sentinal.Github.authorize);

router.get('/github/callback', sentinal.Github.callback, UserController.linkGithub);

module.exports = router;
