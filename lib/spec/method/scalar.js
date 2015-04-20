'use strict';

function Scalar(type) {
  this.type = type;
}

Scalar.create = function(type) {
  type = type || 'Unknown';
  return new Scalar(type);
};

var serializer = {

  String: function(str) {
    return str.toString();
  },

  MethodName: function(str) {
    return str.toLowerCase().replace(/_/g,'');
  },

  Hash: function(hash) {
    return hash.toString('hex');
  },

  Integer: function(number) {
    return parseInt(number);
  }

};

Scalar.prototype.serialize = function(value) {
  if (value === null || !(this.type in serializer)) {
    return value;
  } else {
    return serializer[this.type](value);
  }
};

module.exports = Scalar;
