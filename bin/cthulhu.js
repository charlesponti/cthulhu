#!/usr/bin/env node

const argv = require('yargs').argv;
const path = require('path');
const Liftoff = require('liftoff');
const cthulhu = require('../src');

const cli = new Liftoff({
  name: 'cthulhu'
});

const newCthulhu = cthulhu.configure({
  port: argv.port,
  views: path.resolve(process.cwd(), argv.views)
});

newCthulhu.use(function(req, res) {
  return res.render('index');
});

const invoke = function(env) {
  newCthulhu.start();
  console.log('Cthulhu is rising at port:', argv.port);
};

cli.launch({}, invoke);
