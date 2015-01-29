'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var sources = {
  backend: ['./src/**/*.js']
};

/**
 * @desc Run JSHint against server-side .js files
 */
gulp.task('lint', function() {
  return gulp.src(sources.backend)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

/**
 * @desc Watch for file changes
 */
gulp.task('watch', function() {
  return gulp.watch(sources.backend, ['lint']);
});

gulp.task('default', ['lint', 'watch' ]);
