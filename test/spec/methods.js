'use strict';

var chai = require('chai');
var should = chai.should();

var methods = require('../../lib/spec/methods');

describe('methods', function() {

  var checkParams = function(params) {
    params.serialize.should.be.a('function');
    params.forEach(checkParam);
  };

  var checkResult = function(result) {
    result.type.should.be.a('string');
    result.deserialize.should.be.a('function');
  };

  var checkGroup = function(group) {
    group.name.should.be.a('string');
    group.public.should.be.a('boolean');
    group.description.should.be.a('string');
  };

  var checkParam = function (param) {
    param.name.should.be.a('string');
    param.description.should.be.a('string');
    param.type.should.be.a('string');
    param.serialize.should.be.a('function');
  };

  var checkMethod = function(method) {
    method.name.should.be.a('string');
    method.name.should.have.length.above(0);
    method.description.should.be.a('string');
    checkResult(method.result);
    method.public.should.be.a('boolean');
    checkParams(method.params);
    checkGroup(method.group);
  };

  methods.forEach(function(method) {
    it(method.name, function() { checkMethod(method); })
  });

});
