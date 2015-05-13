'use strict';

var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');

var methods = require('../lib/methods');

describe('methods', function() {

  methods.forEach(function(method) {
    it(method.name, function() {
      method.name[0].should.equal(method.name[0].toUpperCase());

    });
  });

});
