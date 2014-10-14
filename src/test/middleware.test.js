"use strict";

describe("Cthulhu Middleware", function() {

  var Middleware, req;
  var sinon = require("sinon");
  var expect = require("chai").expect;

  beforeEach(function() {
    req = {
      user: null,
      session: {
        user: null
      }
    };
    Middleware = require("../server/helpers/middleware");
  });

  afterEach(function() {
    Middleware = null;
    req = null;
  });

  describe('.logObj', function() {
    it('should log object', function() {
      sinon.spy(console, 'log');
      Middleware.logObj('Foo', { bar: 'bar' });
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

});
