'use strict';

require('simple-syrup-dev').should();

var Scalar = require('../scalar');

describe('Scalar', function() {

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
