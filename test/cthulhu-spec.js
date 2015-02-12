'use strict';

var fs = require('fs');
var cthulhu = require('../src');

describe('Cthulhu', function() {

  var app;

  beforeEach(function() {
    spyOn(fs, 'writeFileSync');
    app = cthulhu.configure({
      port: 1234,
      public: './',
      views: './',
      log: {
        dir: './logs',
        file: 'test.log'
      }
    });
  });

  afterEach(function() {
    app = undefined;
  });

  it('should call fs.writeFileSync', function() {
    expect(fs.writeFileSync).toHaveBeenCalled();
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
      app.addLogger({
        name: 'foo',
        dir: './logs',
        file: 'bar.log',
        config: {}
      });
      expect(app.loggers.foo).not.toEqual(undefined);
      expect(app.loggers.foo.info).not.toEqual(undefined);
      expect(app.loggers.foo.warn).not.toEqual(undefined);
    });
  });

});
