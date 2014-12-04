'use strict';

var cthulhu = require('../src');

describe('Cthulhu', function() {

  var app;

  beforeEach(function() {
    app = cthulhu({
      public: './',
      views: './',
      logFile: './logs/test.log'
    });
  });

  afterEach(function() {
    app = undefined;
  });

  describe('.logger', function() {
    it('should exist', function() {
      expect(app.logger).not.toEqual(undefined);
      expect(app.logger.info).not.toEqual(undefined);
      expect(app.logger.warn).not.toEqual(undefined);
    });
  });

  describe('.addLogger()', function() {
    it('add a logger', function() {
      app.addLogger('foo', './logs/bar.log');
      expect(app.loggers.foo).not.toEqual(undefined);
      expect(app.loggers.foo.info).not.toEqual(undefined);
      expect(app.loggers.foo.warn).not.toEqual(undefined);
    });
  });

});
