describe('AppController', function() {
	'use strict';

	var req, res, AppController;
  var expect = require('chai').expect;
	var HttpFixtures = require('../fixtures/http');

	beforeEach(function() {
		AppController = require('../../server/controllers/app');
		req = HttpFixtures.req();
		res = HttpFixtures.res();
	});

	afterEach(function() {
		AppController = null;
		req = null;
		res = null;
	});

//	describe('#getAbout', function() {
//    it("should call res.render with correct string", function() {
//      AppController.getAbout(req, res);
//      expect(res.render.calledWith("static/about")).to.equal(true);
//    });
//	});
//
//	describe("#getRoot", function() {
//    it("should call res.render with correct string", function() {
//      AppController.getRoot(req, res);
//      expect(res.render.args[0][0]).to.equal("home");
//      expect(res.render.args[0][1].user.email).to.equal("foo@foo.com");
//    });
//	});

});
