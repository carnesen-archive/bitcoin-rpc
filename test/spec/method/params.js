'use strict';

var chai = require('chai');
var should = chai.should();

var Params = require('../../../lib/spec/method/params');

describe('Params', function() {

  var paramsMock = Params.create([{
    name: 'foo',
    type: 'Hash'
  }]);

  it('instantiates from constructor', function() {
    var params = new Params();
    should.exist(params);
  });

  it('instantiates from create', function() {
    var params = Params.create();
    should.exist(params);
  });

  it('instantiates from create with arguments', function() {
    should.exist(paramsMock);
  });

  it('serialize should throw expected number of arguments', function() {
    paramsMock.serialize.bind(paramsMock).should.throw('Expected 1 arguments');
  });

  it('serialize should package arguments into an array', function() {
    paramsMock.serialize('a string')[0].should.equal('a string');
  });

  it('serializes an array', function() {
    paramsMock.serialize(['0'])[0].should.equal('0');
  });

  it('serializes an object', function() {
    paramsMock.serialize({foo: 'beef'})[0].should.equal('beef');
  });

  it('throws an error if param name is unknown', function() {
    var fn = function() { paramsMock.serialize({fo: 'beef'})};
    fn.should.throw('Unknown parameter');
  });

});
