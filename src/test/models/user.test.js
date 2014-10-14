'use strict';

var expect = require("chai").expect;
var sinon = require("sinon");
GLOBAL.Cthulhu = require('../../server')();

describe("User", function() {

  var user;

  beforeEach(function() {
    var User = require('../../server/models/user');
    user = new User({ email: 'foo@foo.com'});
    user.save = sinon.spy();
  });

  afterEach(function() {
    user = null;
  });

  describe('#linkOAuth', function() {

    describe('Link Facebook account', function() {
      it('should set Facebook token, id, and profile', function() {
        var profile = { id: '1234', email: 'foo@foo.com' };
        user.linkOAuth('facebook', 'meowcakes', profile, function(){});
        expect(user.facebook.id).to.equal("1234");
        expect(user.email).to.equal('foo@foo.com');
        expect(user.facebook.token).to.equal("meowcakes");
        expect(user.facebook.profile).to.equal(profile);
      });
    });

    describe('Link Google account', function() {
      it('should set Google token, id, and profile', function() {
        var profile = { id: '1234', emails: [{ value:'foo@foo.com' }] };
        user.linkOAuth('google', 'meowcakes', profile, function(){});
        expect(user.google.id).to.equal("1234");
        expect(user.email).to.equal('foo@foo.com');
        expect(user.google.token).to.equal("meowcakes");
        expect(user.google.profile).to.equal(profile);
      });
    });

    describe('Link Twitter account', function() {
      it('should set Twitter token, id, and profile', function() {
        var profile = { id: '1234', email: 'foo@foo.com' };
        user.linkOAuth('twitter', 'meowcakes', profile, function(){});
        expect(user.twitter.id).to.equal("1234");
        expect(user.email).to.equal('foo@foo.com');
        expect(user.twitter.token).to.equal("meowcakes");
        expect(user.twitter.profile).to.equal(profile);
      });
    });

    describe('Link Foursquare account', function() {
      it('should set Foursquare token, id, and profile', function() {
        var profile = { id: '1234', email: 'foo@foo.com' };
        user.linkOAuth('foursquare', 'meowcakes', profile, function(){});
        expect(user.email).to.equal('foo@foo.com');
        expect(user.foursquare.id).to.equal("1234");
        expect(user.foursquare.token).to.equal("meowcakes");
        expect(user.foursquare.profile).to.equal(profile);
      });
    });

    describe('Link Github account', function() {
      it('should set Github token, id, and profile', function() {
        var profile = { id: '1234', email: 'foo@foo.com' };
        user.linkOAuth('github', 'meowcakes', profile, function(){});
        expect(user.github.id).to.equal("1234");
        expect(user.email).to.equal('foo@foo.com');
        expect(user.github.token).to.equal("meowcakes");
        expect(user.github.profile).to.equal(profile);
      });
    });

  });

  describe("#unlinkOAuth", function() {
    describe('Unlink Facebook', function() {
      it("should unset facebook token and profile", function() {
        user.unlinkOAuth('facebook');
        expect(user.facebook.token).to.equal(undefined);
      });
    });
    describe('Unlink Google', function() {
      it("should unset Google token and profile", function() {
        user.unlinkOAuth('google');
        expect(user.google.token).to.equal(undefined);
      });
    });
    describe('Unlink Twitter', function() {
      it("should unset Twitter token and profile", function() {
        user.unlinkOAuth('twitter');
        expect(user.twitter.token).to.equal(undefined);
      });
    });
    describe('Unlink Foursquare', function() {
      it("should unset Foursquare", function() {
        user.unlinkOAuth('foursquare');
        expect(user.foursquare.token).to.equal(undefined);
      });
    });
    describe('Unlink Github', function() {
      it("should unset Github token and profile", function() {
        user.unlinkOAuth('github');
        expect(user.github.token).to.equal(undefined);
      });
    });
  });
  
  describe('#getEmail', function() {
    it('should return Facebook email', function() {
      var profile = { email: 'foo@foo.com' };
      var email = user.getEmail('facebook', profile);
      expect(email).to.equal('foo@foo.com');
    });
    it('should return Google email', function() {
      var profile = { emails: [{ value: 'foo@foo.com' }] };
      var email = user.getEmail('google', profile);
      expect(email).to.equal('foo@foo.com');
    });
    it('should return Twitter email', function() {
      var profile = { email: 'foo@foo.com' };
      var email = user.getEmail('twitter', profile);
      expect(email).to.equal('foo@foo.com');
    });
    it('should return Github email', function() {
      var profile = { email: 'foo@foo.com' };
      var email = user.getEmail('github', profile);
      expect(email).to.equal('foo@foo.com');
    });
    it('should return Foursquare email', function() {
      var profile = { email: 'foo@foo.com' };
      var email = user.getEmail('foursquare', profile);
      expect(email).to.equal('foo@foo.com');
    });
  });

  describe("#foursquareName", function() {
    it("should return correct name", function() {
      user.foursquare.profile = {
        firstName: 'Foo',
        lastName: 'Bar'
      };
      var name = user.foursquareName();
      expect(name).to.equal("Foo Bar");
    });
  });

  describe("#foursquarePhoto", function() {
    it("should return the correct url for photo", function() {
      user.foursquare.profile = {
        photo: {
          prefix: "foo/",
          suffix: "/bar"
        }
      };
      var photo = user.foursquarePhoto();
      expect(photo).to.equal("foo/original/bar");
    });
  });

  describe("#googlePhoto", function() {
    it("should return the correct url for photo", function() {
      user.google.profile = {
        image: {
          url: "foo?sz=50"
        }
      };
      var photo = user.googlePhoto();
      expect(photo).to.equal("foo?sz=200");
    });
  });
  
  describe('.confirmAccount()', function() {
    it('should set confirmAccountToken to undefined', function() {
      user.confirmAccountToken = 'meow';
      user.confirmAccount();
      expect(user.confirmAccountToken).to.equal(undefined);
    });
  });

  describe('.sendReset()', function() {
    it('should send user reset email', function() {
      sinon.stub(Cthulhu.mailer.emails.users, 'reset');
      user.sendReset();
      expect(Cthulhu.mailer.emails.users.reset.called).to.equal(true);
      expect(user.save.called).to.equal(true);
    });
  });

});
