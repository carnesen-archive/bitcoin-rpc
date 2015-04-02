'use strict';

var chai = require('chai');
var should = chai.should();

var Params = require('../../../lib/spec/method/params');

describe('Params', function() {

  var paramsMock = Params.create([{
    name: 'foo',
    type: 'Hash'
  }]);

  it('Instantiates from constructor', function() {
    var params = new Params();
    should.exist(params);
  });

  it('Instantiates from create', function() {
    var params = Params.create();
    should.exist(params);
  });

  it('Instantiates from create with arguments', function() {
    should.exist(paramsMock);
  });

  it('Serialize should throw expected number of arguments', function() {
    paramsMock.serialize.bind(paramsMock).should.throw('Expected 1 arguments');
  });

  it('Serialize should throw "Unknown type"', function() {
    var fn = function() { paramsMock.serialize({}) };
    fn.should.throw('Unknown type');
  });

  it('Serializes an array', function() {
    paramsMock.serialize(['0']);
  });


});
