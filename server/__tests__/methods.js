'use strict';

require('simple-syrup-dev').should();

var methods = require('../spec').methods;

describe('methods', function() {

  methods.forEach(function(method) {
    it(method.name, function() {
      method.name[0].should.equal(method.name[0].toUpperCase());
    });
  });

});
