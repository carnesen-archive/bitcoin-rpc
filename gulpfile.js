'use strict';

var mocha = require('mocha');
var gulp = require('gulp');

var bitcoreTasks = require('bitcore-build');

//gulp.task('test:integration', function() {
//  //console.log(gulp.src(['integration/**/*.js']).pipe(new mocha({ reporter: 'spec' })))
//  return gulp.src(['integration/**/*.js']).pipe(new mocha({ reporter: 'spec' }));
//});
//
//gulp.task('test:performance', function() {
//  return gulp.src('performance/**/*.js').pipe(new mocha({ reporter: 'spec' }));
//});
//
bitcoreTasks('rpc', {skipBrowser: true});

gulp.task('default', ['lint', 'coverage']);
