'use strict';

var _ = require('lodash');

var conventions = require('./conventions');
var Scalar = require('./scalar');

/***
 * Both params and the result are an instance of the Field class.
 * Fields can have sub-fields. A field without sub-fields is a Scalar.
 * @param name
 * @param opts
 * @constructor
 */
function Field(name, opts) {
  this.name = name;

  opts = opts || {};
  this.default = opts.default;
  this.example = (opts.default !== undefined) ? opts.default : opts.example;

  var convention = conventions(name);
  this.alias = opts.alias || convention.alias;
  var type = (opts.type !== undefined) ? opts.type : convention.type;
  if (type === undefined) {
    type ='Object';
  }

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

Field.prototype.deserialize = function(data) {
  var self = this;

  if (data === undefined) {
    return;
  }

  if (data === null) {
    return null;
  }

  if (this.type instanceof Scalar) {
    return this.type.deserialize(data);
  }

  if (_.isArray(this.type)) {
    if(_.isArray(data)) {
      return data.map(function(item) {
        return self.type[0].deserialize(item);
      })
    } else {
      throw new Error('Expected array of values. Got ' + data)
    }
  }

  if (_.isObject(this.type)) {

    var obj = {};

    // e.g. { chainwork: ChainWork }
    var aliasIndex = {};
    for (var subName in this.type) {
      aliasIndex[this.type[subName].alias] = subName;
    }

    for (var subAlias in data) {
      var subData = data[subAlias];
      if (subAlias in aliasIndex) {
        subName = aliasIndex[subAlias];
        var subField = this.type[subName];
        subData = subField.deserialize.bind(subField)(subData);
      } else {
        subName = subAlias;
      }

      obj[subName] = subData;
    }
    return obj;
  }

};

module.exports = Field;
