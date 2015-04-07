'use strict';

var chai = require('chai');
var should = chai.should();

var Param = require('../../../lib/spec/method/param');

describe('Param', function() {

  var paramMock;
  beforeEach(function() {
    paramMock = new Param({
      name: 'foo',
      type: 'Hash',
      position: 1
    })
  });

  it('Instantiates from constructor', function() {
    should.exist(paramMock)
  });

  it('Instantiates from create', function() {
    var param = Param.create({});
    should.exist(param)
  });

  it('type defaults to String', function() {
    var param = Param.create({});
    param.type.should.equal('String');
  });

  it('throws invalid argument', function() {
    var param = Param.create({});
    param.serialize.bind(param).should.throw('Invalid Argument');
  });

  var types = [];
  for (var type in Param.TYPES) {
    types.push(type);
  }
  types.forEach(function(type){
    it('has type ' + type, function() {
      var param = Param.create({ name: 'foo', type: type });
      param.serialize('bar').should.equal('bar');
    });
  });

});
