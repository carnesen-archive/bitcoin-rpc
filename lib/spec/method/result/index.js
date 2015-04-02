'use strict';

var bitcore = require('bitcore');

function Result(type) {
  type = type || 'None';
  if (!(type in Result.TYPES)) {
    throw new Error('Unknown result type: ' + type)
  }
  this.type = type;
}

Result.create = function(type) {
  return new Result(type);
};

function identity(arg) {
  return arg;
}

function none() {
  return '';
}

function parseHash(str) {
  return new Buffer(str, 'hex');
}

var ChainTip = require('./ChainTip');

Result.TYPES = {
  Boolean: identity,
  Block: bitcore.Block.fromString,
  ChainInfo: require('./ChainInfo'),
  ChainTips: function(list) { return list.map(ChainTip); },
  Float: identity,
  Hash: parseHash,
  HashArray: function(list) { return list.map(parseHash); },
  Info: require('./Info'),
  Int: identity,
  MemPoolInfo: require('./MemPoolInfo'),
  None: none,
  String: identity,
  UtxoInfo: require('./UtxoInfo'),
  UtxoSetInfo: require('./UtxoSetInfo')
};

Result.prototype.deserialize = function(obj) {
  return Result.TYPES[this.type](obj);
};

module.exports = Result;
