'use strict';

var cthulhu = require('../entry');

cthulhu.configure({
  port: 4000,
  views: './views',
  public: './public',
  session: {
    redisHost: 'localhost',
    redisPort: 6379,
    secret: 'foo-bar'
  },
  log: {
    dir: 'logs',
    file: 'all-logs.log'
  },
  middleware: [
    function(req, res, next) {
      console.log('cats');
      return next();
    },
    function(req, res, next) {
      return res.render('index');
    }
  ]
});

cthulhu.use(function(req, res) {
  return res.render('index');
});

cthulhu.start();
