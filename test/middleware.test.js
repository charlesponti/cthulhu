"use strict";

/**
 * Module dependencies
 * @type {exports}
 */
var sinon = require("sinon");
var expect = require("chai").expect;

/**
 * Test dependencies
 * @type {exports}
 */
var HTTPFixtures = require('./fixtures/http');
var middleware = require("../src/server/helpers/middleware");

describe("Cthulhu middleware", function() {

  var req, res, next;

  beforeEach(function() {
    req = HTTPFixtures.req();
    res = HTTPFixtures.res();
    next = function() {};
  });

  afterEach(function() {
    req = null;
    res = null;
  });

  describe('.logObj', function() {
    it('should log object', function() {
      sinon.spy(console, 'log');
      middleware.logObj('Foo', { bar: 'bar' });
      expect(console.log.getCall(0).args[0])
        .to.equal('\u001b[32mFoo\u001b[39m: \u001b[36m{"bar":"bar"}\u001b[39m');
      console.log.restore();
    });
  });

  describe('.logger', function() {

  });

  describe('.browserify', function() {
    it('should return the bundle.dev.js', function() {});
    it('should return the bundle.min.js', function() {});
  });

  describe('.cors', function() {
    it('shoudl set the correct headers', function() {});
  });

  // this.csrf = function(req, res, next) {
  //   var access_token = req.query.access_token;
  //   if (/api/.test(req.originalUrl)) {
  //     if (access_token) {
  //       User
  //         .findOne({ accessToken: access_token })
  //         .exec(function(err, user) {
  //           if (err) return next(err);
  //           if (user.accessToken == access_token) {
  //             req.user = user;
  //             return next();
  //           } else {
  //             return res.status(401).json({
  //               message: 'You must supply access_token'
  //             });
  //           }
  //         })
  //     } else {
  //       return res.status(401).json({
  //         message: 'You must supply access_token'
  //       });
  //     }
  //   } else {
  //     csrf(req, res, next);
  //   }
  // };
  describe('.csrf', function() {
    it('should call csrf if req not /api', function() {
      req.originalUrl = '/meow';
      console.log(req);
      middleware._csrf = sinon.spy();
      middleware.csrf(req, res, next);
      expect(middleware._csrf.called).to.equal(true);
    });
  })
});
