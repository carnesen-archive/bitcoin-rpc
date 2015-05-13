'use strict';

var _ = require('lodash');

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

var Params = require('./params');
var Field = require('./field');

/***
 * Represents a single RPC method function
 * @param name The call name
 * @param opts An object containing the method properties
 * @constructor
 */
function Method(name, opts) {
  $.checkArgument(_.isString(name));
  opts = opts || {};
  this.name = name;
  this.text = opts.text;
  this.group = opts.group;
  this.result = Field.create(name + 'Result', { type: opts.result });
  this.params = Params.create(opts.params);
}

Method.create = function(name, obj) {
  return new Method(name, obj);
};

module.exports = Method;
