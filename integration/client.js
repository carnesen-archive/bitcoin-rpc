'use strict';

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var BitcoinJsonRpc = require('../lib');
var Client = BitcoinJsonRpc.Client;
var requests = BitcoinJsonRpc.Requests.create();

var checkAttributes = function(obj) {
  for (var attr in obj) {
    expect(obj[attr]).to.not.be.undefined;
  }
};

describe('Client:', function() {
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
        checkAttributes(ret);
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
        checkAttributes(ret);
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
        ret.forEach(function(tip) {
          checkAttributes(tip);
        });
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
        for (var txid in ret) {
          checkAttributes(ret[txid]);
        }
        done();
      })
    });

    it('GetTxOut', function (done) {
      var request = requests.GetTxOut({
        txId: '604a76eac59a808e4df2e6ef3821add5355fc6f2dbe6f26cd853a98c9c32b7ff',
        vOut: 0,
        includeMemPool: true
      });
      client.sendRequest(request, function(err, ret) {
        checkAttributes(ret);
        done();
      })
    });

    // GetTxOutSetInfo takes too long

    it('VerifyChain', function (done) {
      client.sendRequest(requests.VerifyChain(0,1), function(err, ret) {
        ret.should.equal(true);
        done();
      })
    });

  });

  describe('Control:', function() {

    var client = Client.create();

    it('GetInfo', function (done) {
      client.sendRequest(requests.GetInfo(), function(err, ret) {
        checkAttributes(ret);
        done();
      })
    });

    it('Help', function (done) {
      client.sendRequest(requests.Help('GetInfo'), function(err, ret) {
        ret.should.contain('bitcoin-cli getinfo');
        done();
      })
    });

    // Stop tested separately
  });
});