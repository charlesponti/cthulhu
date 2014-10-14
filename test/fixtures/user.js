'use strict';

var User = require('../../server/models/user');

var user = new User({
  email: 'foo@foo.com',
  hashed_password: 'QWERTY',
  salt: 'ABCD',
  facebook: {
    id: '123',
    token: '1234',
    email: 'foo@foo.com',
    name: 'Foo Bar'
  },
  twitter: {
    id: '123',
    token: '1234',
    tokenSecret: '4567',
    email: 'foo@foo.com',
    username: 'foobar',
    displayName: 'Foo Bar',
    profile: null
  },
  google: {
    id: '123',
    token: '1234',
    email: 'foo@foo.com',
    name: 'Foo Bar'
  },
  foursquare: {
    id: '1234',
    token: '1234',
    profile: null
  }
});

module.exports = {
  model: User,
  instance: user
};
