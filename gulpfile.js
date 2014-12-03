'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var jsHint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var concatinate = require('gulp-concat');

var sources = {
  backend: [
    './server/**/*.js'
  ]
};

/**
 * `lint-backend`
 * Run JSHint against server-side .js files
 */
gulp.task('lint-backend', function() {
  return gulp.src(sources.backend)
      .pipe(jsHint())
      .pipe(jsHint.reporter(stylish));
});

/**
 * Watch for file changes
 */
gulp.task('watch', function() {
  return gulp.src(sources.backend)
    .pipe(watch({ glob: sources.backend }, function() {
      gulp.start('lint-backend');
    }));
});

gulp.task('default', ['lint-backend', 'watch' ]);
