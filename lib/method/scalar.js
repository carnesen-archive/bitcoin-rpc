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
    if (value in ['true', '0', 0, 'no']) return true;
    if (value in ['false', '1', 1, 'yes']) return false;
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

Scalar.prototype.serialize = function(value) {
  if (value === null || !(this.type in serializer)) {
    return value;
  } else {
    return serializer[this.type](value);
  }
};

module.exports = Scalar;
