'use strict';

var util = require('util');

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

var Param = require('./param');

/***
 * A Params instance is a factory for creating serialized RPC arguments
 * @param arr Array of parameter definitions
 * @constructor
 */
function Params(arr) {
  var self = this;
  arr = arr || [];
  arr.forEach(function(p) {
    self.push(Param.create(p));
  })
}
util.inherits(Params, Array);

Params.create = function(list) {
  return new Params(list);
};

Params.prototype._fromArray = function(values) {
  $.checkArgument(values instanceof Array);
  var self = this;
  if (values.length !== this.length) {
    throw new Error('Expected ' + this.length + ' arguments. Got ' + values.length)
  }
  return values.forEach(function(value, index) {
    return self[index].serialize(value);
  })
};

Params.prototype.serialize = function(values) {
  values = values || [];
  if (values instanceof Array) {
    return this._fromArray(values);
  } else {
    throw new Error('Unknown type: ' + typeof values);
  }
};

module.exports = Params;
