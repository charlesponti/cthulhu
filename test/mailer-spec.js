
var sinon = require('sinon');
var assert = require('chai').assert;

describe('Mailer', function() {
  'use strict';

  var mailer;
  var Mailer = require('../src/mailer');

  beforeEach(function() {
    mailer = Mailer({
      service: 'foo',
      username: 'foo@foo.com',
      password: 'foobarbaz'
    });
    sinon.spy(mailer.transporter, 'sendMail');
  });

  afterEach(function() {
    mailer = null;
  });

  describe('#sendMail', function(){
    it('should pass sendMail correct params', function() {
      mailer.sendMail({
        to: 'foo@foo.com',
        from: 'foo@foo.com',
        subject: 'fooSubject',
        html: 'fooHTML',
        text :'fooText'
      }, function() {});
      var args = mailer.transporter.sendMail.lastCall.args;
      assert.equal(mailer.transporter.sendMail.called, true);
      assert.equal(args[0].from, 'foo@foo.com');
      assert.equal(args[0].to, 'foo@foo.com');
      assert.equal(args[0].subject, 'fooSubject');
      assert.equal(args[0].text, 'fooText');
      assert.equal(args[0].html, 'fooHTML');
    });
  });

});
