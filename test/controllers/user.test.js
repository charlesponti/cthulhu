
describe('$userCtrl', function() {

  'use strict';

  var req, res, User, user, $userCtrl;

  var sinon = require('sinon');
  var expect = require('chai').expect;
  var HttpFixtures = require('../fixtures/http');

  beforeEach(function() {    
    var UserFixture = require('../fixtures/user');
    User = UserFixture.model;
    user = UserFixture.instance;
    user.save = sinon.spy();
    req = HttpFixtures.req();
    req.user = user;
    res = HttpFixtures.res();
    $userCtrl = require('../../src/server/controllers/user');
  });

  afterEach(function() {
    User = null;
    user = null;
    req = null;
    res = null;
    $userCtrl = null;
  });

  describe('Link Oauth Strategies', function() {

    var spy;

    beforeEach(function() {
      var spy = sinon.spy();
      sinon.spy(User, 'findOne');
      req._oauth = { profile: { email: 'foo@foo.com' } };
      sinon.stub($userCtrl.emitter, 'emit', spy);
    });

    afterEach(function() {
      User.findOne.restore();
      $userCtrl.emitter.emit.restore();
    });

    describe('#linkFacebook', function() {
      it('should call User.findOne if no req.user', function() {
        req.user = null;
        $userCtrl.linkFacebook(req, res);
        expect(User.findOne.called).to.equal(true);
      });
      it('should emit link-oauth if req.user', function() {
        $userCtrl.linkFacebook(req, res);
        expect(User.findOne.called).to.equal(false);
        expect($userCtrl.emitter.emit.args[0][0]).to.equal('link-oauth');
      });
    });

    describe('#linkGoogle', function() {
      it('should call User.findOne if no req.user', function() {
        req.user = null;
        req._oauth = { profile: { emails: [{value: 'foo@foo.com'}] } };
        $userCtrl.linkGoogle(req, res);
        expect(User.findOne.called).to.equal(true);
      });
      it('should emit link-oauth if req.user', function() {
        $userCtrl.linkGoogle(req, res);
        expect(User.findOne.called).to.equal(false);
        expect($userCtrl.emitter.emit.args[0][0]).to.equal('link-oauth');
      });
    });

    describe('#linkTwitter', function() {
      it('should call User.findOne if no req.user', function() {
        req.user = null;
        $userCtrl.linkTwitter(req, res);
        expect(User.findOne.called).to.equal(true);
      });
      it('should emit link-oauth if req.user', function() {
        $userCtrl.linkTwitter(req, res);
        expect(User.findOne.called).to.equal(false);
        expect($userCtrl.emitter.emit.args[0][0]).to.equal('link-oauth');
      });
    });

    describe('#linkFoursquare', function() {
      it('should call User.findOne if no req.user', function() {
        req.user = null;
        $userCtrl.linkFoursquare(req, res);
        expect(User.findOne.called).to.equal(true);
      });
      it('should emit link-oauth if req.user', function() {
        $userCtrl.linkFoursquare(req, res);
        expect(User.findOne.called).to.equal(false);
        expect($userCtrl.emitter.emit.args[0][0]).to.equal('link-oauth');
      });
    });

    describe('#linkGithub', function() {
      it('should call User.findOne if no req.user', function() {
        req.user = null;
        $userCtrl.linkGithub(req, res);
        expect(User.findOne.called).to.equal(true);
      });
      it('should emit link-oauth if req.user', function() {
        $userCtrl.linkGithub(req, res);
        expect(User.findOne.called).to.equal(false);
        expect($userCtrl.emitter.emit.args[0][0]).to.equal('link-oauth');
      });
    });

  });
  
  describe('.serve', function() {
    describe(".login()", function() {
      it('should call res.render with correct args', function() {
        $userCtrl.serve.login(req, res);
        expect(res.render.calledWith("users/login")).to.equal(true);
      });
    });
    describe(".account()", function() {
      it('should call res.render with correct args', function() {
        req.isAuthenticated = sinon.stub().returns(true);
        $userCtrl.serve.account(req, res);
        expect(res.render.calledWith("users/account")).to.equal(true);
      });
    });
  });

  describe("#deleteAccount", function() {
    var exec;

    beforeEach(function() {
      exec = sinon.spy();
      User.remove = sinon.stub().returns({
        exec: exec
      });
    });

    afterEach(function() {
      User.remove.reset();
    });

    it("should set twitter token to undefined", function() {
      req.user._id = "1";
      $userCtrl.deleteAccount(req, res);
      expect(User.remove.calledWith({ _id: "1" })).to.equal(false);
    });
  });

  describe("onDeleteAccount", function() {

    var next;

    beforeEach(function() {
      next = sinon.spy();
    });

    afterEach(function() {
      next = null;
    });

    describe("if error", function() {
      it("should call next with error", function() {
        $userCtrl.emitter.emit('account-delete', true, req, res);
        expect(next.calledWith("foo"));
      });
      it("should not call req.logout", function() {
        $userCtrl.emitter.emit('account-delete', true, req, res);
        expect(req.logout.called).to.equal(false);
      });
      it("should not call res.redirect", function() {
        $userCtrl.emitter.emit('account-delete', true, req, res);
        expect(res.redirect.called).to.equal(true);
      });
    });

    describe("if no error", function() {
      it("should call req.logout", function() {
        $userCtrl.emitter.emit('account-delete', null, req, res);
        expect(req.logout.called).to.equal(true);
      });
      it("should call req.flash with success", function() {
        $userCtrl.emitter.emit('account-delete', null, req, res);
        expect(req.flash.calledWith("success", "Your account has been deleted."))
          .to.equal(true);
      });
      it("should call res.redirect with correct path", function() {
        $userCtrl.emitter.emit('account-delete', null, req, res);
        expect(res.redirect.calledWith("/")).to.equal(true);
      });
    });
  });
  
  describe('.confirmAccount', function() {
    it('should call User.find with correct args', function() {
      req.params.token = 'foobar';
      var exec = sinon.spy();
      User.findOne = sinon.stub(User, 'findOne', function() {
        return { exec: exec };
      });
      $userCtrl.confirmAccount(req, res);
      expect(User.findOne.calledWith({ confirmAccountToken: 'foobar'})).to.equal(true);
      expect(exec.called).to.equal(true);
    });
  });

  describe('Events', function() {
    describe('account-delete', function() {
      it('should handle error', function() {
        $userCtrl.emitter.emit('account-delete', true, req, res);
        expect(req.flash.getCall(0).args[0]).to.equal('error');
        expect(res.redirect.calledWith('/account'));
        expect(req.logout.called).to.equal(false);
      });
      it('should handle success', function() {
        $userCtrl.emitter.emit('account-delete', false, req, res);
        expect(req.logout.called).to.equal(true);
        expect(req.flash.getCall(0).args[0]).to.equal('success');
        expect(res.redirect.calledWith('/')).to.equal(true);
      });
    });
    describe('account-confirm', function() {
      it('should handle error', function() {
        $userCtrl.emitter.emit('account-confirm', true, null, req, res);
        expect(req.flash.getCall(0).args[0]).to.equal('error');
        expect(res.redirect.calledWith('/login'));
        expect(req.login.called).to.equal(false);
      });
      it('should handle success', function() {
        $userCtrl.emitter.emit('account-confirm', false, 'foo', req, res);
        expect(req.login.calledWith('foo')).to.equal(true);
        expect(req.flash.getCall(0).args[0]).to.equal('success');
        expect(res.redirect.calledWith('/account')).to.equal(true);
      });
    });
    describe('oauth-linked', function() {
      it('should handle error with req.user', function() {
        var err = { message: 'foo' };
        $userCtrl.emitter.emit('oauth-linked', err, null, req, res);
        expect(req.flash.calledWith('error', 'foo')).to.equal(true);
        expect(res.status.getCall(0).args[0]).to.equal(500);
        expect(res.redirect.getCall(0).args[0]).to.equal('/account');
      });
      it('should handle error without req.user', function() {
        var err = { message: 'foo' };
        req.user = null;
        $userCtrl.emitter.emit('oauth-linked', err, null, req, res);
        expect(req.flash.calledWith('error', 'foo')).to.equal(true);
        expect(res.status.getCall(0).args[0]).to.equal(500);
        expect(res.redirect.getCall(0).args[0]).to.equal('/login');
      });
      it('should handle success with req.user', function() {
        req.user = null;
        $userCtrl.emitter.emit('oauth-linked', null, 'foo', req, res);
        expect(req.login.getCall(0).args[0]).to.equal('foo');
        expect(req.flash.getCall(0).args[0]).to.equal('success');
        expect(res.redirect.getCall(0).args[0]).to.equal('/account');
      });
      it('should handle success without req.user', function() {
        $userCtrl.emitter.emit('oauth-linked', null, 'foo', req, res);
        expect(req.login.called).to.equal(false);
        expect(req.flash.getCall(0).args[0]).to.equal('success');
        expect(res.redirect.getCall(0).args[0]).to.equal('/account');
      });
    });
    describe('link-oauth', function() {

      beforeEach(function() {
        req.user.linkOAuth = sinon.spy();
        req.user.hasProvider = sinon.stub();
        req._oauth = { token: 'fooToken', profile: { id: '123' } };
      });

      it('should handle error with req.user', function() {
        $userCtrl.emitter.emit('link-oauth', true, null, 'foo', req, res);
        expect(req.flash.getCall(0).args[0]).to.equal('error');
        expect(res.status.args[0][0]).to.equal(500);
        expect(res.redirect.args[0][0]).to.equal('/account');
      });
      it('should handle error without req.user', function() {
        req.user = null;
        $userCtrl.emitter.emit('link-oauth', true, null, 'foo', req, res);
        expect(req.flash.getCall(0).args[0]).to.equal('error');
        expect(res.status.args[0][0]).to.equal(500);
        expect(res.redirect.args[0][0]).to.equal('/login');
      });
      it('should handle success with req.user', function() {
        $userCtrl.emitter.emit('link-oauth', false, null, 'foo', req, res);
        expect(req.user.linkOAuth.args[0][0]).to.equal('foo');
        expect(req.user.linkOAuth.args[0][1]).to.equal('fooToken');
        expect(req.user.linkOAuth.args[0][2].id).to.equal('123');
      });
    });
    describe('unlink-oauth', function() {
      it('should handle error', function() {
        $userCtrl.emitter.emit('unlink-oauth', true, null, 'foo', req, res);
        expect(req.flash.args[0][0]).to.equal('error');
        expect(res.redirect.args[0][0]).to.equal('/account');
      });
      it('should handle success', function() {
        $userCtrl.emitter.emit('unlink-oauth', false, null, 'foo', req, res);
        expect(req.flash.args[0][0]).to.equal('success');
        expect(res.redirect.args[0][0]).to.equal('/account');
      });
    });
    describe('login', function() {
      it('should login user', function() {
        $userCtrl.emitter.emit('login', 'foo', req, res);
        expect(req.login.args[0][0]).to.equal('foo');
        expect(req.flash.args[0][0]).to.equal('success');
        expect(res.redirect.args[0][0]).to.equal('/account');
      });
    });
  });
});
