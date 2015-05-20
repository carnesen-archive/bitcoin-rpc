'use strict';

var chai = require('chai');
chai.should();

var methods = require('../lib/spec').methods;

describe('methods', function() {

  methods.forEach(function(method) {
    it(method.name, function() {
      method.name[0].should.equal(method.name[0].toUpperCase());
    });
  });

});
