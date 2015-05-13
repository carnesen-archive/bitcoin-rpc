'use strict';

var config = require('config');
var async = require('async');
var chai = require('chai');
chai.should();

var rpc = require('../lib');
var requests = rpc.requests;

var client = rpc.Client.create(config.get('client'));

describe('GetBlock', function() {

  this.timeout(20000);

  var blockIds;
  before(function(done) {
    var heights = [];
    for (var i = 0; i < 50000; i++) {
      heights.push(i);
    }
    async.mapLimit(heights, 1000, function(height, cb) {
      client.sendRequest(requests.GetBlockHash(height), cb);
    },
    function(err, results) {
      if (err) return done(err);
      blockIds = results;
      done();
    });
  });

  it('GetInfo', function(done) {
    async.mapLimit(blockIds, 100, function(blockId, cb) {
      client.sendRequest(requests.GetBlock(blockId), cb);
    },
    function(err) {
      if (err) return done(err);
      done();
    });
  });
});