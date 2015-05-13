#!/usr/local/bin/node
'use strict';

var config = require('config');

var rpc = require('../lib');
var requests = rpc.requests;
var client = rpc.Client.create(config.get('client'));

var commandArgs = process.argv.slice(2);
var methodName = commandArgs[0];
var callArgs = commandArgs.slice(1);

var request = requests[methodName].apply(this, callArgs);

client.sendRequest(request, function(err, ret) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(ret);
});
