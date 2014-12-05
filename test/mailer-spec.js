'use strict';

describe('Mailer', function() {

  var Mailer = require('../src/mailer');
  var mailer;

  beforeEach(function() {
    mailer = Mailer({
      service: 'foo',
      username: 'foo@foo.com',
      password: 'foobarbaz'
    });
    spyOn(mailer.transporter, 'sendMail');
  });

  afterEach(function() {
    mailer = null;
  });

  describe('#sendMail', function(){
    it('should pass sendMail correct params', function() {
      mailer.sendMailCallback = 'fooFunction';
      mailer.sendMail({
        to: 'foo@foo.com',
        from: 'foo@foo.com',
        subject: 'fooSubject',
        html: 'fooHTML',
        text :'fooText'
      });
      var args = mailer.transporter.sendMail.mostRecentCall.args;
      expect(mailer.transporter.sendMail).toHaveBeenCalled();
      expect(args[0].from).toEqual('foo@foo.com');
      expect(args[0].to).toEqual('foo@foo.com');
      expect(args[0].subject).toEqual('fooSubject');
      expect(args[0].text).toEqual('fooText');
      expect(args[0].html).toEqual('fooHTML');
      expect(args[1]).toEqual('fooFunction');
    });
  });

});
