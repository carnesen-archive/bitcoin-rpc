'use strict';

var util = require('util');
var _ = require('lodash');

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
  arr.forEach(function(param, position) {
    param.position = position;
    self.push(Param.create(param));
  })
}
util.inherits(Params, Array);

Params.create = function(list) {
  return new Params(list);
};

/***
 * Serialize a parameter set from an object of values
 * @param obj
 * @private
 */
Params.prototype._fromObject = function(obj) {
  var arr = [];
  $.checkArgument(obj);
  for (var attr in obj) {
    var param = _.find(this, function(param) {
      return param.name === attr;
    });
    if (!param) {
      throw new Error ('Unknown parameter: ' + attr);
    }
    arr[param.position] = obj[attr];
  }
  return this._fromArray(arr);
};

/***
 * Serialize a set of parameters from an array
 * @param values
 * @returns {Array|Object|string|*}
 * @private
 */
Params.prototype._fromArray = function(values) {
  $.checkArgument(values instanceof Array);
  var self = this;
  if (values.length !== this.length) {
    throw new Error('Expected ' + this.length + ' arguments. Got ' + values.length)
  }
  return values.map(function(value, index) {
    return self[index].serialize(value);
  })
};

/***
 * Serialize a set of request input values
 * @param args
 * @returns {Array|Object|string|*}
 */
Params.prototype.serialize = function(args) {
  if (_.isArray(args)) {
    return this._fromArray(args);
  } else if (_.isObject(args)) {
    return this._fromObject(args);
  } else {
    var arr = [];
    for(var i in arguments) {
      arr.push(arguments[i]);
    }
    return this._fromArray(arr)
  }
};

module.exports = Params;
