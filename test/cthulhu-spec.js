'use strict';

var cthulhu = require('../src');
var chai = require('chai');
var assert = chai.assert;

describe('Cthulhu', function() {

  var app;

  beforeEach(function() {
    process.env.INIT_DIR = './';
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

  describe('.logger', function() {
    it('should exist', function() {
      assert.notEqual(app.logger, undefined);
      assert.notEqual(app.logger.info, undefined);
      assert.notEqual(app.logger.warn, undefined);
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
      assert.notEqual(app.loggers.foo, undefined);
      assert.notEqual(app.loggers.foo.info, undefined);
      assert.notEqual(app.loggers.foo.warn, undefined);
    });
  });

});
