'use strict';

var yaml = require('js-yaml');
var fs = require('fs');

var Method = require('./method');

var methods = [];

var directory = __dirname + '/yml';

fs.readdirSync(directory)

  .forEach(function(fileName) {
    var fileContent = yaml.safeLoad(fs.readFileSync(directory + '/' + fileName));
    for (var name in fileContent.methods ) {
      var opts = fileContent.methods[name];
      opts.group = fileContent.group;
      methods.push(Method.create(name, opts));
    }
  })
;

module.exports = methods;
