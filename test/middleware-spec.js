'use strict';

var express = require('express');

describe('Cthulhu Middleware', function() {

  var middleware, request, response, next;

  beforeEach(function() {
    request = express.request;
    response = express.response;
    next = jasmine.createSpy('next');
    middleware = require('../src/middleware');
  });

  afterEach(function() {
    request =
    response =
    middleware = undefined;
  });

  describe('.remember()', function() {
    it('should call req.session.returnTo for non excluded route', function() {
      var req = {
        path: '/foo',
        session: {}
      };
      middleware.remember(/bar/gi, req, response, next);
      expect(req.session.returnTo).toEqual('/foo');
      expect(next).toHaveBeenCalled();
    });
    it('should not call req.session.returnTo for excluded route', function() {
      var req = {
        path: '/foo',
        session: {}
      };
      middleware.remember(/foo/gi, req, response, next);
      expect(req.session.returnTo).toEqual(undefined);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('.locals()', function() {

  });

  describe('.cors()', function() {

  });

});
