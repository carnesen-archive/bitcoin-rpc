'use strict';

var chai = require('chai');
var should = chai.should();

var Result = require('../../../lib/spec/method/result');

describe('Result types', function() {

  var resultMock;
  beforeEach(function() {
    resultMock = new Result();
  });

  it('instantiates from constructor', function() {
    should.exist(resultMock)
  });

  it('instantiates from create', function() {
    var result = Result.create();
    should.exist(result)
  });

  it('instantiates from create with type argument', function() {
    var result = Result.create('None');
    should.exist(result)
  });

  it('has default type None', function() {
    resultMock.type.should.equal('None');
  });

  it('throws unknown type error', function() {
    var fn = function() { Result.create('Foo')};
    fn.should.throw('Unknown result type')
  });

  it('deserializes a Block', function() {
    var obj = '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c0101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000';
    Result.create('Block').deserialize(obj).header.time.should.equal(1231006505);
  });

  it('deserializes a Boolean', function() {
    var obj = JSON.parse('true');
    Result.create('Boolean').deserialize(obj).should.equal(true);
    obj = JSON.parse('false');
    Result.create('Boolean').deserialize(obj).should.equal(false);
  });

  it('deserializes a ChainInfo object', function() {
    var obj = JSON.parse('{"chain":"main","blocks":350144,"headers":350144,"bestblockhash":"0000000000000000133c0ded9aad3e2dc02a66ed25367e978ff74e4396339bd4","difficulty":46717549644.70642090,"verificationprogress":0.99996328,"chainwork":"00000000000000000000000000000000000000000005ce1bc2ed7d12da8b011e"}');
    var result = Result.create('ChainInfo');
    result.deserialize(obj).nBlocksProcessed.should.equal(350144);
  });

  it('deserializes a ChainTips object', function() {
    var obj = JSON.parse('[{"height":350152,"branchlen":1,"status":"valid-fork"},{"height":337825,"hash":"0000000000000000047b08613012d1961773968c620663f06ecb23fa5043403c","branchlen":1,"status":"valid-fork"},{"height":337487,"hash":"00000000000000001210610f61d4661422395cfb10f0946921e80d6825275c07","branchlen":1,"status":"valid-headers"},{"height":337487,"hash":"00000000000000001aad4da61bba2d712f43226c439ce55c8336e659e81aadb4","branchlen":1,"status":"valid-fork"}]')
    var result = Result.create('ChainTips');
    result.deserialize(obj)[0].statusDescription.should.equal('This branch is not part of the active chain, but is fully validated')
  });

  it('deserializes an Info object', function() {
    var obj = JSON.parse('{"version":100000,"protocolversion":70002,"walletversion":60000,"balance":0.00000000,"blocks":349368,"timeoffset":0,"connections":39,"proxy":"","difficulty":46717549644.70642090,"testnet":false,"keypoololdest":1419981359,"keypoolsize":101,"paytxfee":0.00000000,"relayfee":0.00001000,"errors":""}');
    Result.create('Info').deserialize(obj).nConnections.should.equal(39);
  });

  it('deserializes a Float object', function() {
    var obj = 46717549644.70642090;
    Result.create('Float').deserialize(obj).should.be.a('number');
  });

  it('deserializes a Hash object', function() {
    var obj = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';
    Result.create('Hash').deserialize(obj).should.be.instanceof(Buffer);
  });

  it('deserializes a HashArray object', function() {
    var obj = ["ff669ba1b0db653603e2263a4f3060c8f3ff3f871d5ce0ed7556906317a7a510","ff9216dfe58d6d9d69ce3bc992dd4adf733e2e5c0e6ad0c3cc45902a2198c1c0","ffc2c459e9ea5b1e8f8ff300dfa40df7fc5054385faadf53fe4e3b67c1057af3","ffe479f40d1158022cacc5a81c753e617456016dabe72bc633a76417e6d019bb"];
    Result.create('HashArray').deserialize(obj).should.be.instanceof(Array);
  });

  it('deserializes a MemPoolInfo object', function() {
    var obj = JSON.parse('{"size":2238,"bytes":1435890}');
    Result.create('MemPoolInfo').deserialize(obj).nTransactions.should.equal(2238);
  });

  it('deserializes a None object', function() {
    var obj = 'foo';
    Result.create('None').deserialize(obj).should.equal('');
  });

  it('deserializes a String object', function() {
    var obj = 'foo';
    Result.create('String').deserialize(obj).should.equal('foo');
  });

  it('deserializes a UtxoInfo object', function() {
    var obj = JSON.parse('{"bestblock":"000000000000000004b605337388bbc06f1bc6c8f89a286162e5388cdb70ec74","confirmations":1,"value":4.99900000,"scriptPubKey":{"asm":"OP_DUP OP_HASH160 3dc5f3765e415b39a6a26b004ca265d345957c39 OP_EQUALVERIFY OP_CHECKSIG","hex":"76a9143dc5f3765e415b39a6a26b004ca265d345957c3988ac","reqSigs":1,"type":"pubkeyhash","addresses":["16ddMae5ZQUwu6q1UGg1Q9FDag7cxYWnU9"]},"version":1,"coinbase":false}');
    Result.create('UtxoInfo').deserialize(obj).nConfirmations.should.equal(1);
  });

  it('deserializes a UtxoSetInfo object', function() {
    var obj = JSON.parse('{"height":350158,"bestblock":"0000000000000000051373518e35562fc5806b2ad721d1e948e6914fa15a8611","transactions":5161248,"txouts":18120195,"bytes_serialized":641444402,"hash_serialized":"cb198033ea52eccd83b8c822a92902518895b5849e3300343d0b161b14c77505","total_amount":14003814.77136098}');
    Result.create('UtxoSetInfo').deserialize(obj).nBytesSerialized.should.equal(641444402);
  });

});
