'use strict';

var yaml = require('js-yaml');
var fs = require('fs');

var Method = require('./method');

var methods = [];

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

fileContents.forEach(function(fileContent) {
  fileContent = yaml.safeLoad(fileContent);
  for (var name in fileContent.methods ) {
    var opts = fileContent.methods[name];
    opts.group = fileContent.group;
    methods.push(Method.create(name, opts));
  }
});

var spec = {
  methods: methods
};
module.exports = spec;
