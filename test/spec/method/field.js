'use strict';

var chai = require('chai');
var should = chai.should();

var Field = require('../../../lib/spec/method/field');
var Scalar = require('../../../lib/spec/method/scalar');

describe('Field', function() {

  var f;
  beforeEach(function() {
    f = new Field('foo');
  });

  it('instantiates from constructor', function() {
    should.exist(f);
  });

  it('instantiates from create', function() {
    f = Field.create('foo');
    should.exist(f)
  });

  it('throws "no default" on serialize if no data or default is provided', function() {
    f.serialize.bind(f).should.throw('no default')
  });

  it('has type Scalar if provided a string for its type', function() {
    f = Field.create('foo', { type: 'Bar' });
    f.type.should.be.instanceof(Scalar);
  });

  it('has type Array if provided an Array for its type', function() {
    f = Field.create('foo', { type: ['Bar'] });
    f.type.should.be.instanceof(Array);
    f.type[0].type.should.be.instanceof(Scalar);
    f.serialize(['a', 'b', 'c'])[2].should.equal('c');
  });

  it('has type Object if provided an Object for its type', function() {
    f = Field.create('foo', { type: { subFoo: 'Bar'} });
    f.type.subFoo.type.should.be.instanceof(Scalar);
    f.serialize({ subFoo: 'asdf' }).subfoo.should.equal('asdf');
  });

});
