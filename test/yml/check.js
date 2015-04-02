'use strict';

var chai = require('chai');
var should = chai.should();

var Spec = require('../../lib/spec');

describe('Check YAML specifications', function() {

  var spec = Spec.create();
  spec.loadDirectory(__dirname + '/../../lib/yml');

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
    method.group.should.be.a('string');
  };

  describe('Method checks', function () {
    spec.methods.forEach(function(method) {
      it(method.name, function() { checkMethod(method); })
    });
  });

  describe('Group checks', function () {
    spec.groups.forEach(function(group) {
      it(group.name, function() { checkGroup(group); })
    });
  });

});
