'use strict';

/**
 * Module dependencies
 * @type {exports}
 */
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

function Cthulhu(cwd) {

  this.createNew = function createNew(name) {
    if (name) {
      var newPath = path.resolve(cwd, './'+name);
      fs.copy(__dirname+'/../src', newPath, function(err) {
        if (err) {
          return console.error(err);
        }
        console.log(
          chalk.purple("Baby Cthulhu successfully born! Her name is"),
          chalk.green.bold(name)
        );
      });
    } else {
      console.log(chalk.red.bold("Must supply project name!"));
    }
  };

}

module.exports = function(cwd) {
  new Cthulhu(cwd);
};
