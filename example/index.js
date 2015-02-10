'use strict';

var cthulhu = require('../src');

cthulhu.configure({
  port: 3000,
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
  }
});



cthulhu.use(function(req, res) {
  return res.render('index');
});

cthulhu.start();
