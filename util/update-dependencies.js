'use strict';

var async = require('async');
var exec = require('child_process').exec;

var p = require('../package.json');

var dependencies = [];
for (var dependency in p.devDependencies) {
  dependencies.push(dependency);
}

async.mapSeries(dependencies, function(dep, cb) {
  exec('npm install ' + dep + ' --save-dev', cb);
});

