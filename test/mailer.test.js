'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var Mailer = require('../src/server/mailer');
var config = require('../src/server/config');

describe('Mailer', function() {

  var mailer;

  beforeEach(function() {
    mailer = new Mailer(config.Mailer);
    mailer.transporter.sendMail = sinon.spy();
  });
  
  afterEach(function() {
    mailer = null;
  });

  describe('#sendMail', function(){
    it('should pass sendMail correct params', function() {
      mailer.sendMailCallback = 'fooFunction';
      mailer.sendMail('foo@foo.com', 'fooSubject', 'fooText', 'fooHTML');
      var args = mailer.transporter.sendMail.args[0];
      expect(mailer.transporter.sendMail.called).to.equal(true);
      expect(args[0].from).to.equal('foo@foo.com');
      expect(args[0].to).to.equal('foo@foo.com');
      expect(args[0].subject).to.equal('fooSubject');
      expect(args[0].text).to.equal('fooText');
      expect(args[0].html).to.equal('fooHTML');
      expect(args[1]).to.equal('fooFunction');
    });
  });

  describe('.emails', function() {
    
    var emails;

    beforeEach(function() {
      emails = mailer.emails;
      mailer.sendMail = sinon.spy();
    });

    describe('.users', function() {
      
      describe('.welcome', function() {
        it('should call sendMail with correct args', function() {
          emails.users.welcome({ 
            email: 'foo@foo.com',  
            confirmAccountToken: 'foobar'
          });
          expect(mailer.sendMail.getCall(0).args.join('')).to.equal(
            'foo@foo.com'+
            'Welcome to Cthulhu!'+
            'Welcome to Cthulhu, foo@foo.com!'+
            '<h2>Welcome to Cthulhu, foo@foo.com</h2>\n\n'+
            '<a href="http://localhost:4000/account/confirm/foobar">'+
            '\n\tConfirm Account\n</a>\n\n<div>\n  '+
            '<h2> Thanks for signing up! </h2>\n</div>\n'
          );
        });
      });

    });

  });


});
