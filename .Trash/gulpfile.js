'use strict';

var gulp = require('gulp');

require('simple-syrup-dev').defineGulpTasks(gulp);

//gulp.task('test:integration', function() {
//  //console.log(gulp.src(['integration/**/*.js']).pipe(new mocha({ reporter: 'spec' })))
//  return gulp.src(['integration/**/*.js']).pipe(new mocha({ reporter: 'spec' }));
//});
//
//gulp.task('test:performance', function() {
//  return gulp.src('performance/**/*.js').pipe(new mocha({ reporter: 'spec' }));
//});
//
