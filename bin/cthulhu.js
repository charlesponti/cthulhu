#!/usr/bin/env node

const fs = require('fs');
const argv = require('yargs').argv;
const path = require('path');
const Liftoff = require('liftoff');
const cthulhu = require('../src');
const configFilePath = path.resolve(process.cwd(), './cthulhu.conf.js');

const port = argv.p || argv.port;

if (fs.existsSync(configFilePath)) {
  var config = require(configFilePath);
  var newCthulhu = cthulhu.configure(config);
}
else if (port) {
  var newCthulhu = cthulhu.configure({
    port: argv.port || port,
    views: path.resolve(process.cwd(), argv.views || 'views')
  });

  // If --html5, add support for HTML5 pushState
  if (argv.html5) {
    newCthulhu.use(require('connect-history-api-fallback'));
  }

  // Render index file in views directory
  newCthulhu.use(function(req, res) {
    res.render('index');
  });
}
else {
  throw new Error('Must create cthulhu.conf.js file.');
}

const cli = new Liftoff({
  name: 'cthulhu'
});

const invoke = function(env) {
  newCthulhu.start();
};

cli.launch({}, invoke);
