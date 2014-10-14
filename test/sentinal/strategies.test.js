'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('Sentinal Strategies', function() {

  var sentinal;

  beforeEach(function() {
    sentinal = require('../../src/server/sentinal');
  });

  describe('Facebook Strategy', function() {
    it('should throw error if no app_id', function() {
      expect(sentinal.bind(this, { 
        Facebook: {
          app_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Facebook with app_id');
    });
    it('should throw error if no app_secret', function() {
      expect(sentinal.bind(this, { 
        Facebook: {
          app_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Facebook with app_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(sentinal.bind(this, { 
        Facebook: {
          app_id: 'fooId',
          app_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Facebook with callback_url');
    });
    it('should set Facebook', function() {
      var oauth = sentinal({ 
        Facebook: {
          app_id: 'fooId',
          app_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(oauth.Facebook.app_id).to.equal('fooId');
      expect(oauth.Facebook.app_secret).to.equal('fooSecret');
      expect(oauth.Facebook.callback_url).to.equal('http://foo.com');
    });
  });

  describe('Google Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(sentinal.bind(this, { 
        Google: {
          app_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Google Strategy with client_id');
    });
    it('should throw error if no client_secret', function() {
      expect(sentinal.bind(this, { 
        Google: {
          client_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Google Strategy with client_secret');
    });
    it('should throw error if no redirect_uri', function() {
      expect(sentinal.bind(this, { 
        Google: {
          client_id: 'fooId',
          client_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Google Strategy with redirect_uri');
    });
    it('should set Google', function() {
      var oauth = sentinal({ 
        Google: {
          client_id: 'fooId',
          client_secret: 'fooSecret',
          redirect_uri: 'http://foo.com'
        } 
      });
      expect(oauth.Google.client_id).to.equal('fooId');
      expect(oauth.Google.client_secret).to.equal('fooSecret');
      expect(oauth.Google.redirect_uri).to.equal('http://foo.com');
    });
  });

  describe('Twitter Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(sentinal.bind(this, { 
        Twitter: {
          consumer_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Twitter Strategy with consumer_key');
    });
    it('should throw error if no client_secret', function() {
      expect(sentinal.bind(this, { 
        Twitter: {
          consumer_key: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Twitter Strategy with consumer_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(sentinal.bind(this, { 
        Twitter: {
          consumer_key: 'fooId',
          consumer_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Twitter Strategy with callback_url');
    });
    it('should set Twitter', function() {
      var oauth = sentinal({ 
        Twitter: {
          consumer_key: 'fooId',
          consumer_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(oauth.Twitter.consumer_key).to.equal('fooId');
      expect(oauth.Twitter.consumer_secret).to.equal('fooSecret');
      expect(oauth.Twitter.callback_url).to.equal('http://foo.com');
    });
  });

describe('Foursquare Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(sentinal.bind(this, { 
        Foursquare: {
          client_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Foursquare Strategy with client_id');
    });
    it('should throw error if no client_secret', function() {
      expect(sentinal.bind(this, { 
        Foursquare: {
          client_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Foursquare Strategy with client_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(sentinal.bind(this, { 
        Foursquare: {
          client_id: 'fooId',
          client_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Foursquare Strategy with callback_url');
    });
    it('should set Foursquare', function() {
      var oauth = sentinal({ 
        Foursquare: {
          client_id: 'fooId',
          client_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(oauth.Foursquare.client_id).to.equal('fooId');
      expect(oauth.Foursquare.client_secret).to.equal('fooSecret');
      expect(oauth.Foursquare.callback_url).to.equal('http://foo.com');
    });
  });

describe('Github Strategy', function() {
    it('should throw error if no client_id', function() {
      expect(sentinal.bind(this, { 
        Github: {
          client_secret: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Github Strategy with client_id');
    });
    it('should throw error if no client_secret', function() {
      expect(sentinal.bind(this, { 
        Github: {
          client_id: 'fooId',
          callback_url: 'http://foo.com'
        } 
      })).to.throw('Must supply Github Strategy with client_secret');
    });
    it('should throw error if no callback_url', function() {
      expect(sentinal.bind(this, { 
        Github: {
          client_id: 'fooId',
          client_secret: 'fooSecret'
        } 
      })).to.throw('Must supply Github Strategy with callback_url');
    });
    it('should set Github', function() {
      var oauth = sentinal({ 
        Github: {
          client_id: 'fooId',
          client_secret: 'fooSecret',
          callback_url: 'http://foo.com'
        } 
      });
      expect(oauth.Github.client_id).to.equal('fooId');
      expect(oauth.Github.client_secret).to.equal('fooSecret');
      expect(oauth.Github.callback_url).to.equal('http://foo.com');
    });
  });

});
