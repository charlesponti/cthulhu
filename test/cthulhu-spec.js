'use strict';

var cthulhu = require('../src');

describe('Cthulhu', function() {

  var app;

  beforeEach(function() {
    app = cthulhu({
      public: './',
      views: './'
    });
  });

  afterEach(function() {
    app = undefined;
  });

  describe('.addLogger()', function() {
    it('should exist', function() {
      expect(app.addLogger).not.toEqual(undefined);
    });
  });

});
