'use strict';

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

/***
 * Represents an RPC method parameter. Each instance
 * is a factory for creating serialized RPC arguments.
 * @param opts
 * @constructor
 */
function Param(opts) {
  this.name = opts.name;
  this.type = (opts.type in Param.TYPES) ? opts.type : 'String';
  this.description = opts.description || '';
}

Param.create = function(opts) {
  return new Param(opts);
};

Param.TYPES = {
  String: function(str) { return str.toString(); },
  Hash: function(hash) { return hash.toString('hex'); },
  Int: function(number) { return number.toString(); },
  Boolean: function(bool) { return bool.toString()}
};

Param.prototype.serialize = function(value) {
  $.checkArgument(value !== undefined);
  return Param.TYPES[this.type](value);
};

module.exports = Param;
