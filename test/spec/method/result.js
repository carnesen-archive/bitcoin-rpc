'use strict';

var chai = require('chai');
var should = chai.should();

var Result = require('../../../lib/spec/method/result/index');

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
    var obj = JSON.parse('[{"height":350152,"hash":"0000000000000000032de7060a125cf122315713ceff4b7acb8fc7f24cdb1a82","branchlen":1,"status":"headers-only"},{"height":350151,"hash":"000000000000000010f068da88d60fa5b606a8a17a70f10ba4b31834372f5e08","branchlen":0,"status":"active"},{"height":349844,"hash":"0000000000000000127825ede10ee446409ed45b877102e01b3419238723cdb8","branchlen":1,"status":"valid-headers"},{"height":349381,"hash":"00000000000000000f96353e54291354c800bb6b7b74b2d50287fe80de630ab6","branchlen":1,"status":"valid-headers"},{"height":349073,"hash":"00000000000000000814d4017c1e5cb6e0356a0afe3d3c2df9b297f81fb8887c","branchlen":1,"status":"valid-headers"},{"height":349012,"hash":"00000000000000000f13059bcfbb63896365273a8360b60ead58a5e623d0555c","branchlen":1,"status":"valid-fork"},{"height":348323,"hash":"00000000000000000811b958ae99a783e29cd8be33b266b3716cc96f5758c560","branchlen":2,"status":"valid-headers"},{"height":348234,"hash":"000000000000000007b73d1dd03cd355fe279a690996f65607f8bd71cf2e94c5","branchlen":1,"status":"valid-headers"},{"height":347915,"hash":"000000000000000015d5ab1da595af39a41e251fbbfeba6fd6329b8bc174dc56","branchlen":1,"status":"valid-headers"},{"height":347508,"hash":"00000000000000000f329e6fb8d85af6096ac0beeba36cb7cee27d6b72584c6b","branchlen":1,"status":"valid-fork"},{"height":347167,"hash":"0000000000000000071412f6831a0f03b5abfb7490e8a4dfa13c82d6805096f1","branchlen":1,"status":"valid-fork"},{"height":347110,"hash":"000000000000000006330b6072ad80ffb03924dafef7d01fd099d4ebd051457c","branchlen":1,"status":"valid-fork"},{"height":346319,"hash":"0000000000000000051df08a973095ac3e4db9fcf55aabba3c869d3eb588cf3f","branchlen":1,"status":"valid-headers"},{"height":346310,"hash":"000000000000000000853b74b4ba57ffe5a5bd711e298c615ffbece916e43805","branchlen":1,"status":"valid-headers"},{"height":345711,"hash":"00000000000000001607d9d8e49e3958923f1b6a4ebd465dea0fc5f92596c3a1","branchlen":1,"status":"valid-fork"},{"height":345603,"hash":"000000000000000003e14626f77a919aef071b3ee4983eb536cfaffaadd916f6","branchlen":1,"status":"valid-headers"},{"height":344949,"hash":"0000000000000000047b1d4d9fe55b1f760ccebd18b6c0df6f44ec8e109fe26c","branchlen":1,"status":"valid-fork"},{"height":344102,"hash":"00000000000000000f3f190cc07acf0954257a067c816b12fa146257196f6208","branchlen":1,"status":"valid-headers"},{"height":344083,"hash":"000000000000000017872b73085231b313a5650cedb84f5eb07720b5072151e0","branchlen":1,"status":"valid-headers"},{"height":343611,"hash":"00000000000000000c22cecee194f817c576aaf1e257fc7f7687e62ac61235ce","branchlen":1,"status":"valid-headers"},{"height":343040,"hash":"0000000000000000178c36d05055451ed54ddf0a7aa16254dd5a0f4ad6a9b696","branchlen":1,"status":"valid-headers"},{"height":342894,"hash":"0000000000000000107d44a08b8ac2c49ff63e21db1b2e25bf52c39ae01093c2","branchlen":1,"status":"valid-headers"},{"height":341975,"hash":"00000000000000000d1ad922242c25d4b453a23aa92e61cabb3c6ace6a5feb96","branchlen":1,"status":"valid-headers"},{"height":341878,"hash":"0000000000000000185a0231847cb73c879e6748f1ee55595cb718bdf253358a","branchlen":1,"status":"valid-fork"},{"height":341517,"hash":"0000000000000000036cdca9dacebc0c4adda60fe356bac499e4d68f26c4fc17","branchlen":1,"status":"valid-headers"},{"height":341377,"hash":"000000000000000016aac6dabc230dd8255588b6bc90b6272ef5c146b78539dd","branchlen":1,"status":"valid-headers"},{"height":339997,"hash":"000000000000000005f091f1cd179e0778e1cc100602c3b4214a9a3de902c7be","branchlen":1,"status":"valid-fork"},{"height":338253,"hash":"000000000000000017232ad82611afd3d71dd603e0c59e3ab64b0c46ae98d32d","branchlen":1,"status":"valid-headers"},{"height":338201,"hash":"00000000000000001af1d128a22cb75af69e9a371d95a311a1f9607c96fe9d7c","branchlen":1,"status":"valid-headers"},{"height":338104,"hash":"00000000000000000a94800d048597fbca04b8ddcdeca57c32b47a3d5d21929a","branchlen":1,"status":"valid-headers"},{"height":338076,"hash":"0000000000000000150a61a673d507abd74c2f7ea3ec2b872ef7b893af3035c7","branchlen":1,"status":"valid-fork"},{"height":337825,"hash":"0000000000000000047b08613012d1961773968c620663f06ecb23fa5043403c","branchlen":1,"status":"valid-fork"},{"height":337487,"hash":"00000000000000001210610f61d4661422395cfb10f0946921e80d6825275c07","branchlen":1,"status":"valid-headers"},{"height":337487,"hash":"00000000000000001aad4da61bba2d712f43226c439ce55c8336e659e81aadb4","branchlen":1,"status":"valid-fork"}]')
    var result = Result.create('ChainTips');
    result.deserialize(obj)[0].statusDescription.should.equal('Not all blocks for this branch are available, but the headers are valid')
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
