#!/usr/bin/env node

const fs = require('fs');
const argv = require('yargs').argv;
const path = require('path');
const Liftoff = require('liftoff');
const cthulhu = require('../src');
const configFilePath = path.resolve(process.cwd(), './cthulhu.conf.js');

if (fs.existsSync(configFilePath)) {
  var config = require(configFilePath);
  var newCthulhu = cthulhu.configure(config);
}
else {
  var newCthulhu = cthulhu.configure({
    port: argv.p || argv.port || 3000,
    public: path.resolve(process.cwd(), argv.public || '.'),
    views: path.resolve(process.cwd(), argv.views || '.')
  });

  // Render index file in views directory
  newCthulhu.use(function(req, res) {
    res.render('index');
  });
}

const cli = new Liftoff({
  name: 'cthulhu'
});

const invoke = function(env) {
  newCthulhu.start();
};

cli.launch({}, invoke);
