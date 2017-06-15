'use strict';

function Scalar(type) {
  this.type = type;
}

Scalar.create = function(type) {
  type = type || 'Unknown';
  return new Scalar(type);
};

var serializer = {

  Boolean: function(value) {
    var ret = value;
    if ([true, 'true', '1', 1, 'yes'].indexOf(value) > -1) ret = true;
    if ([false, 'false', 0, 0, 'no'].indexOf(value) > -1) ret = false;
    return ret;
  },

  Hash: function(hash) {
    return hash.toString('hex');
  },

  Integer: function(number) {
    return parseInt(number);
  },

  MethodName: function(str) {
    return str.toLowerCase().replace(/_/g,'');
  },

  String: function(str) {
    return str.toString();
  }

};

var deserializer = {

};

Scalar.prototype.serialize = function(value) {
  if (value === null || !(this.type in serializer)) {
    return value;
  } else {
    return serializer[this.type](value);
  }
};

Scalar.prototype.deserialize = function(value) {
  if (value === null || !(this.type in deserializer)) {
    return value;
  } else {
    return deserializer[this.type](value);
  }
};

module.exports = Scalar;
