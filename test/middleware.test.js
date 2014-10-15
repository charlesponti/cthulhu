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
    next = sinon.spy();
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

  describe('.csrf', function() {
    it('should call csrf if req not /api', function() {
      req.originalUrl = '/foo';
      middleware._csrf = sinon.spy();
      middleware.csrf(req, res, next);
      expect(middleware._csrf.called).to.equal(true);
    });
    it('should not call _csrf if req is /api', function() {
      req.originalUrl = '/api/foo';
      middleware._csrf = sinon.spy();
      middleware.csrf(req, res, next);
      expect(middleware._csrf.called).to.equal(false);
    });
    it('should return error if no access_token', function() {
      req.originalUrl = '/api/foo';
      middleware.csrf(req, res, next);
      expect(res.status.called).to.equal(true);
    });
    it('should not return error if access_token', function() {
      req.originalUrl = '/api/foo';
      req.query.access_token = 'foobar';
      middleware.csrf(req, res, next);
      expect(res.status.called).to.equal(false);
    });
  });

  describe('Events', function() {
    describe('api-user', function() {
      it('should call next if error', function() {
        middleware.emitter.emit('api-user', 'foo', null, req, res, next);
        expect(next.called).to.equal(true);
        expect(next.args[0][0]).to.equal('foo');
      });
    });
  });

});
