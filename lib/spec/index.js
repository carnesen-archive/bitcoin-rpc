'use strict';

var yaml = require('js-yaml');
var fs = require('fs');

var Group = require('./group');
var Method = require('./method/index');

/***
 * A Spec instance contains the complete specification for the available RPC methods
 * @constructor
 */
function Spec(directory) {
  directory = directory || __dirname + '/../yml';
  this.directory = directory;
  this.methods = [];
  this.groups = [];
  this.load();
}

Spec.create = function(directory) {
  return new Spec(directory);
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
 */
Spec.prototype.load = function() {
  var self = this;

  fs.readdirSync(self.directory)

    .filter(function(fileName) {
      return fileName.indexOf('.yml') > -1;
    })

    .forEach(function(fileName) {
      var fileContent = yaml.safeLoad(fs.readFileSync(self.directory + '/' + fileName));
      self.loadMethodGroup(fileContent)
    })

  ;
};

module.exports = Spec;
