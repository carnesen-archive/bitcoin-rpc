'use strict';

var yaml = require('js-yaml');
var fs = require('fs');

var Method = require('./method');
var Group = require('./group');

// Read files manually instead of in a loop for brfs
var fileContents = [
  fs.readFileSync(__dirname + '/yml/BlockChain.yml'),
  fs.readFileSync(__dirname + '/yml/Control.yml'),
  fs.readFileSync(__dirname + '/yml/Generating.yml'),
  fs.readFileSync(__dirname + '/yml/Mining.yml'),
  fs.readFileSync(__dirname + '/yml/Network.yml'),
  fs.readFileSync(__dirname + '/yml/RawTransactions.yml'),
  fs.readFileSync(__dirname + '/yml/Util.yml'),
  fs.readFileSync(__dirname + '/yml/Wallet.yml')
];

var methods = [];

var groups = [];

fileContents.forEach(function(fileContent) {
  var obj = yaml.safeLoad(fileContent);
  var groupMethods = [];
  for (var name in obj.methods ) {
    var opts = obj.methods[name];
    opts.group = obj.group;
    groupMethods.push(Method.create(name, opts));
  }
  var group = Group.create({
    name: obj.group,
    text: obj.text,
    methods: groupMethods
  });
  groups.push(group);
  methods = methods.concat(groupMethods);
});

var spec = {
  methods: methods,
  groups: groups
};
module.exports = spec;
