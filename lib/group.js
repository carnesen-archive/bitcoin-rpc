'use strict';

function Group(opts) {
  opts = opts || {};
  this.name = opts.name;
  this.text = opts.text;
  this.methods = opts.methods;
}

Group.create = function(opts) {
  return new Group(opts);
};

module.exports = Group;
