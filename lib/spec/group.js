'use strict';

/***
 * Each yml spec file describes a group of Bitcoin Core RPC methods.
 * Group-level properties are stored in an instance of Group.
 *
 * @param obj An object containing the group properties
 * @constructor
 */
function Group(obj) {
  obj = obj || {};
  this.name = obj.name || '';
  this.public = obj.public === 'yes';
  this.description = obj.description || '';
}

Group.create = function (obj) {
  return new Group(obj);
};

module.exports = Group;
