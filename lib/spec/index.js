'use strict';

var yaml = require('js-yaml');
var fs = require('fs');

var Group = require('./group');
var Method = require('./method/index');

/***
 * A Spec instance contains the complete specification for the available RPC methods
 * @constructor
 */
function Spec() {
  this.methods = [];
  this.groups = [];
}

Spec.create = function() {
  return new Spec();
};

/***
 * Loads the contents of a single yml file into the spec
 * @param obj
 */
Spec.prototype.loadMethodGroup = function(obj) {
  var self = this;

  var group = Group.create(obj.group);

  this.groups.push(group);

  obj.methods.forEach(function(m) {
    self.methods.push(Method.create(m, group));
  });
};

/***
 * Reads *.yml in the directory provided and constructs from those
 * specs a list of JSON-RPC groups and methods.
 * @param directory Path of the directory containing yml spec files
 */
Spec.prototype.loadDirectory = function(directory) {
  var self = this;

  fs.readdirSync(directory)

    .filter(function(fileName) {
      return fileName.indexOf('.yml') > -1;
    })

    .forEach(function(fileName) {
      var fileContent = yaml.safeLoad(fs.readFileSync(directory + '/' + fileName));
      self.loadMethodGroup(fileContent)
    })

  ;
};

module.exports = Spec;
