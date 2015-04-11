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

  it('has String type', function() {
    var param = Param.create({ name: 'foo', type: 'String' });
    param.serialize('bar').should.equal('bar');
  });

  it('has Hash type', function() {
    var param = Param.create({ name: 'foo', type: 'Hash' });
    param.serialize(new Buffer('beef', 'hex')).should.equal('beef');
  });

  it('has Int type', function() {
    var param = Param.create({ name: 'foo', type: 'Int' });
    param.serialize(1).should.equal(1);
    param.serialize(' 1.0 ').should.equal(1);
  });

  it('has Boolean type', function() {
    var param = Param.create({ name: 'foo', type: 'Boolean' });
    param.serialize(true).should.equal(true);
  });

  it('has MethodName type', function() {
    var param = Param.create({ name: 'foo', type: 'MethodName' });
    param.serialize('ASDF').should.equal('asdf');
  });

});
