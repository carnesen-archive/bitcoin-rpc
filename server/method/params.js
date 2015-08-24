'use strict';

var util = require('util');
var _ = require('lodash');

var Field = require('./field');

/***
 * @param opts
 * @constructor
 */
function Params(opts) {
  opts = opts || [];
  this.fields = opts.map(function(item) {
    return Field.create(item.name, item);
  });
}

Params.create = function(opts) {
  return new Params(opts);
};

/***
 * Function that returns a serialized version of the arguments provided
 * @returns Array
 */
Params.prototype.serialize = function() {
  var arr = [];
  for (var index in this.fields) {
    var value = this.fields[index].serialize(arguments[index]);
    if (value !== null) {
      arr.push(value);
    }
  }
  return arr;
};

module.exports = Params;
