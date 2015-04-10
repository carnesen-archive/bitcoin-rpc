'use strict';

var chai = require('chai');
var should = chai.should();

var BitcoinJsonRpc = require('../lib');
var Client = BitcoinJsonRpc.Client;
var requests = BitcoinJsonRpc.Requests.create();

describe('BlockChain', function() {

  var blockHash = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';
  var client = Client.create();

  it('GetBestBlockHash', function (done) {
    client.sendRequest(requests.GetBestBlockHash(), function(err, ret) {
      ret.toString('hex')[0].should.equal('0');
      done();
    })
  });

  it('GetBlock verbose', function (done) {
    var request = requests.GetBlock(blockHash, true);
    client.sendRequest(request, function(err, ret) {
      ret.nConfirmations.should.be.above(0);
      done();
    })
  });

  it('GetBlock', function (done) {
    var request = requests.GetBlock(blockHash, false);
    client.sendRequest(request, function(err, ret) {
      ret.hash.should.equal(blockHash);
      done();
    })
  });

  it('GetBlockChainInfo', function (done) {
    var request = requests.GetBlockChainInfo();
    client.sendRequest(request, function(err, ret) {
      ret.nBlocksProcessed.should.be.above(0);
      done();
    })
  });

  it('GetBlockCount', function (done) {
    var request = requests.GetBlockCount();
    client.sendRequest(request, function(err, ret) {
      ret.should.be.above(0);
      done();
    })
  });

  it('GetBlockHash', function (done) {
    var request = requests.GetBlockHash(0);
    client.sendRequest(request, function(err, ret) {
      ret.toString('hex').should.equal(blockHash);
      done();
    })
  });

  it('GetChainTips', function (done) {
    var request = requests.GetChainTips();
    client.sendRequest(request, function(err, ret) {
      ret.should.have.length.above(0);
      done();
    })
  });

  it('GetDifficulty', function (done) {
    var request = requests.GetDifficulty();
    client.sendRequest(request, function(err, ret) {
      ret.should.be.above(0);
      done();
    })
  });

  it('GetMemPoolInfo', function (done) {
    var request = requests.GetMemPoolInfo();
    client.sendRequest(request, function(err, ret) {
      ret.nTransactions.should.be.above(0);
      done();
    })
  });

  it('GetRawMemPool', function (done) {
    var request = requests.GetRawMemPool({verbose: false});

    client.sendRequest(request, function(err, ret) {
      ret.forEach(function(txid){
        txid.should.be.a('string');
      });
      done();
    })
  });

  it('GetRawMemPool verbose', function (done) {
    var request = requests.GetRawMemPool(true);

    client.sendRequest(request, function(err, ret) {
      for(var txid in ret) {
        ret[txid].nBytes.should.be.above(0);
        ret[txid].fee.should.be.a('number');
        ret[txid].arrivalTime.should.be.a('number');
        ret[txid].arrivalHeight.should.be.a('number');
        ret[txid].arrivalPriority.should.be.a('number');
        ret[txid].currentPriority.should.be.a('number');
      }
      done();
    })
  });

});
