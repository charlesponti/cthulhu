describe('ApiController', function() {
  "use strict";

  var req, res, ApiController;

  GLOBAL.App = {};
  var expect = require("chai").expect;
  var HttpFixtures = require('../fixtures/http');

  beforeEach(function() {
    ApiController = require("../../server/controllers/api");
    req = HttpFixtures.req();
    res = HttpFixtures.res();
  });

  describe('#getMe', function() {
    it('should return 400 if req not authenticated', function() {
      req.isAuthenticated.returns(false);
      ApiController.getMe(req, res);
      expect(res.status.called).to.equal(true);
      expect(res.status.args[0][0]).to.equal(401);
    });
    it('should return send correct json if user not authenticated', function() {
      req.isAuthenticated.returns(false);
      ApiController.getMe(req, res);
      expect(res.json.called).to.equal(true);
      expect(res.json.args[0][0].message).to.equal("No user signed in.");
    });
    it('should return 200 if req is authenticated', function() {
      req.isAuthenticated.returns(true);
      ApiController.getMe(req, res);
      expect(res.status.called).to.equal(true);
      expect(res.status.args[0][0]).to.equal(200);
    });
    it('should return send correct json if user not authenticated', function() {
      req.isAuthenticated.returns(true);
      ApiController.getMe(req, res);
      expect(res.json.called).to.equal(true);
      expect(res.json.args[0][0].email).to.equal("foo@foo.com");
    });
  });

});
