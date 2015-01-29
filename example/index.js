'use strict';

var cthulhu = require('../src');

cthulhu.configure({
  port: 3000,
  views: './views',
  public: './public',
  sessionStore: 'foo-bar',
  sessionSecret: 'foo-bar',
  logFile: './logs/all-logs.log'
});

cthulhu.use(function(req, res, next) {
  return res.render('index');
});

cthulhu.start();
