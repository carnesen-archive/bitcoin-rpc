'use strict';

var Params = require('./params');
var Result = require('./result/index');

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

/***
 * Represents a single RPC method function
 * @param obj An object containing the group properties
 * @param group A Group instance
 * @constructor
 */

function Method(obj, group) {
  $.checkArgument(obj && group);
  this.name = obj.name;
  this.description = obj.description || '';
  this.result = Result.create(obj.result);
  this.params = Params.create(obj.params);
  this.public = (obj.public) ? obj.public === 'yes' : group.public;
  this.group = group.name;
}

Method.create = function(obj, group) {
  return new Method(obj, group);
};

module.exports = Method;
