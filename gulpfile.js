'use strict';

var gulp = require('gulp');

var coveralls = require('gulp-coveralls');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var shell = require('gulp-shell');

var files = ['lib/**/*.js'];
var tests = ['test/**/*.js'];
var alljs = files.concat(tests);

var buildBinPath = './node_modules/.bin/';

/**
 * testing
 */

gulp.task('test:node', function() {
  return gulp.src(tests).pipe(new mocha({ reporter: 'spec' }));
});

gulp.task('test', ['test:node']);

/**
 * code quality and documentation
 */

gulp.task('lint', function() {
  return gulp.src(alljs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('plato', shell.task([buildBinPath + 'plato --dir report --recurse --jshint .jshintrc lib']));

gulp.task('coverage', shell.task([buildBinPath + './istanbul cover ' + buildBinPath + '_mocha -- --recursive']));

gulp.task('coveralls', ['coverage'], function() {
  gulp.src('coverage/lcov.info').pipe(coveralls());
});

gulp.task('default', ['lint', 'coverage']);
