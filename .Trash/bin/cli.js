#!/usr/bin/env node
'use strict';

var config = require('config');

var rpc = require('../index');
var requests = rpc.requests;
var methods = rpc.spec.methods;
var groups = rpc.spec.groups;
var client = rpc.Client.create(config.get('client'));

var cl = console.log;

var commandArgs = process.argv.slice(2);
var callArgs = commandArgs.slice(1);

var methodName, doHelp;
if (commandArgs[0] === 'help') {
  doHelp = true;
  methodName = commandArgs[1];
} else {
  doHelp = false;
  methodName = commandArgs[0];
}

function briefUsage(method) {
  var paramsString = method.params.fields.map(function(field) {
    return (field.default === undefined) ? field.name : '[' + field.name + ']';
  }).join(' ');
  return method.name + ' ' + paramsString;
}

function listMethods() {
  groups.forEach(function(group) {
    cl(group.name + ':');
    group.methods.forEach(function(method) {
      cl('  ' + briefUsage(method));
    });
    cl();
  });
  process.exit(1);
}

if (methodName === undefined) {
  listMethods();
}

var methodNames = methods.map(function(method) {
  return method.name;
});

var methodIndex = methodNames.indexOf(methodName);
if (methodIndex === -1){
  cl('Error: Unknown method name "' + methodName + '"');
  process.exit(1);
}

function usage(method) {
  cl('Usage: cli.js ' + briefUsage(method));
  briefUsage(method);
  process.exit(1);
}

if (doHelp) {
  usage(methods[methodIndex]);
}

var request = requests[methodName].apply(this, callArgs);

client.sendRequest(request, function(err, ret) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(ret);
});
