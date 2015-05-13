'use strict';

var chai = require('chai');
var should = chai.should();

var Params = require('../../lib/method/params');

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

  it('serializes', function() {
    paramsMock.serialize('beef', 'pie')[0].should.equal('beef');
  });

});
