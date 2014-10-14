"use strict";

var config = require('../../server/config');
var Sentinal = require("../../server/sentinal/index")(config.OAuth);

describe("Sentinal.Auth", function() {

  var Auth, req;
  var sinon = require("sinon");
  var expect = require("chai").expect;

  beforeEach(function() {
    req = {
      user: null,
      session: {
        user: null
      }
    };
    Auth = Sentinal.auth;
  });

  afterEach(function() {
    Auth = null;
    req = null;
  });

  describe("#isAuthenticated", function() {
    it("should return true if user", function() {
      req.user = true;
      expect(Auth.isAuthenticated.apply(req)).to.equal(true);
    });
    it("should return false if no user", function() {
      req.user = false;
      expect(Auth.isAuthenticated.apply(req)).to.equal(false);
    });
  });

  describe("#logIn", function() {
    it("should set value of req.session", function() {
      Auth.logIn.call(req, { id: "foo" });
      expect(req.session.user).to.equal("foo");
    });
  });

  describe("#deserializeUser", function() {
    var func, callback, next;

    beforeEach(function() {
      callback = sinon.spy();
      func = Auth.deserializeUser(callback);
      next = sinon.spy();
      Auth.deserialize_done = sinon.spy();
    });

    afterEach(function() {
      func = null;
    });

    it("should return a function", function() {
      expect(typeof func).to.equal("function");
    });
    it("should call next if no req.session", function() {
      req.session = null;
      func(req, null, next);
      expect(next.called).to.equal(true);
    });
    it("should call next if no req.session.user", function() {
      func(req, null, next);
      expect(next.called).to.equal(true);
    });
    it("should call callback if req.session && req.session", function() {
      req.session.user = "meow";
      func(req, null, next);
      expect(callback.called).to.equal(true);
    });
  });

  describe('deserialized event', function() {
    it('should assign user to req', function() {
      var next = sinon.spy();
      Auth.emitter.emit('deserialized', req, null, next, null, 'foo');
      expect(req.user).to.equal('foo');
      expect(next.called).to.equal(true);
    });
  });

  describe("#logOut", function() {
    it("should set value of req.session", function() {
      Auth.logOut.call(req);
      expect(req.session.user).to.equal(undefined);
    });
  });

});
