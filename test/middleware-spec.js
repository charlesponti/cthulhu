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
    it('should add values to res.locals', function() {
      request.user = 'foo';
      response.locals = {};
      middleware.locals({ foo: 'bar' }, request, response, next);
      expect(response.locals.foo).toEqual('bar');
      expect(response.locals.app_name).toEqual('Cthulhu');
      expect(response.locals.success_message).toEqual({});
      expect(response.locals.error_message).toEqual({});
      expect(response.locals.current_user).toEqual('foo');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('.cors()', function() {
    it('should set headers', function() {
      middleware.cors(request, response, next);
      expect(response._headers['access-control-allow-origin']).toEqual('*');
      expect(response._headers['access-control-allow-methods'])
        .toEqual('GET,PUT,POST,PATCH,DELETE');
      expect(response._headers['access-control-allow-headers'])
        .toEqual('X-Requested-With, X-Access-Token, X-Revision, Content-Type');
      expect(next).toHaveBeenCalled();
    });
    it('should call res.send if OPTIONS request', function() {
      spyOn(response, 'send');
      request.method = 'OPTIONS';
      middleware.cors(request, response, next);
      expect(response.send).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });
  });

});
