'use strict';

var _ = require('lodash');

var bitcore = require('bitcore');
var $ = bitcore.util.preconditions;

var conventions = require('./conventions');
var Scalar = require('./scalar');

function Field(name, opts) {

  $.checkArgument(name);
  this.name = name;

  opts = opts || {};
  this.default = opts.default;
  this.example = (opts.default === undefined) ? opts.example : opts.default;

  var convention = conventions(name);
  this.alias = opts.alias || convention.alias;
  var type = opts.type || convention.type;

  if (_.isString(type)) {
    this.type = Scalar.create(type);
  }

  else if (_.isArray(type)) {
    this.type = [ Field.create(name + 'Item', { type: type[0] }) ];
  }

  else if (_.isObject(type)) {
    var obj = {};
    for (var subName in type) {

      obj[subName] = Field.create(subName, type[subName]);
    }
    this.type = obj;
  }

  if(opts.default !== undefined) {
    this.default = opts.default;
  }

  if(opts.text) {
    this.text = opts.text;
  }

}

Field.create = function(name, opts) {
  return new Field(name, opts);
};

Field.prototype.serialize = function(data) {
  var self = this;

  if (data === undefined) {
    if (this.default === undefined) {
      throw new Error('Field ' + this.name + ' has no default nor was data provided');
    }
    data = this.default;
  }

  if (data === null) {
    return null;
  }

  if (this.type instanceof Scalar) {
    return this.type.serialize.bind(this.type)(data);
  }

  if (_.isArray(this.type)) {
    if(_.isArray(data)) {
      return data.map(function(item) {
        return self.type[0].serialize(item);
      })
    } else {
      throw new Error('Expected array of values. Got ' + data)
    }
  }

  if (_.isObject(this.type)) {
    var obj = {};
    for (var subName in this.type) {
      var subField = this.type[subName];
      var subData = data[subName] || data[subField.alias];
      obj[subField.alias] = subField.serialize.bind(subField)(subData);
    }
    return obj;
  }

};

module.exports = Field;
