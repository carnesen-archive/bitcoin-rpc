'use strict';

var yaml = require('js-yaml');
var fs = require('fs');

var Group = require('./group');
var Method = require('./method');

/***
 * Loads the contents of a single yml file into the spec
 * @param obj
 */

function loadMethodGroup(obj) {
  var group = Group.create(obj.group);
  
  obj.methods.forEach(function(m) {
    methods.push(Method.create(m, group));
  });
}

var directory = __dirname + '/yml';
var methods = [];
fs.readdirSync(directory)

  .filter(function(fileName) {
    return fileName.indexOf('.yml') > -1;
  })

  .forEach(function(fileName) {
    var fileContent = yaml.safeLoad(fs.readFileSync(directory + '/' + fileName));
    loadMethodGroup(fileContent)
  })
;

module.exports = methods;
