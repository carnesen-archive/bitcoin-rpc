'use strict';

var config = require('config');
var async = require('async');
var chai = require('chai');
chai.should();

var rpc = require('../lib');
var requests = rpc.requests;

var client = rpc.Client.create(config.get('client'));


function getInfo() {
  it('GetInfo', function(done) {
    var request = requests.GetInfo();
    client.sendRequest(request, function (err, ret) {
      if (err) {
        console.log(err);
        return done();
      }
      done();
    });
  });
}

function getBlockHash() {
  it('GetBlockHash', function(done) {
    var request = requests.GetBlockHash('1');
    console.log('asdf')
    client.sendRequest(request, function (err, ret) {
      if (err) {
        console.log(err);
        return done();
      }
      done();
    });
  });
}

describe('Client performance tests', function() {
  this.timeout(10000);
  async.series([getInfo, getBlockHash], console.log);
});