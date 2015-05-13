'use strict';

var chai = require('chai');
var should = chai.should();

var Scalar = require('../../lib/method/scalar');

describe('Scalar', function() {

  it('instantiates from constructor', function() {
    var s = new Scalar();
    should.exist(s);
  });

  it('instantiates from create', function() {
    var s = Scalar.create();
    should.exist(s);
  });

  it('serializes a String', function() {
    Scalar.create('String').serialize(1).should.equal('1');
  });

  it('serializes a Hash', function() {
    Scalar.create('Hash').serialize(new Buffer('beef', 'hex')).should.equal('beef');
  });

  it('serializes an Integer', function() {
    Scalar.create('Integer').serialize(' 1.0 ').should.equal(1);
  });

  it('serializes a Boolean', function() {
    Scalar.create('Boolean').serialize('1').should.equal(true);
  });

  it('serializes a MethodName', function() {
    Scalar.create('MethodName').serialize('GetInfo').should.equal('getinfo');
  });

});
