'use strict';

require('simple-syrup-dev').should();

var Field = require('../field');
var Scalar = require('../scalar');

describe('Field', function() {

  var f;
  beforeEach(function() {
    f = new Field('foo');
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
    f = Field.create('foo', {
      type: {
        subFoo: { type: 'String' }
      }
    });
    f.type.subFoo.type.should.be.instanceof(Scalar);
    f.serialize({ subFoo: 'asdf' }).subfoo.should.equal('asdf');
  });

  it('can navigate combined Array and Object types', function() {
    f = Field.create('foo', {
      type: [{
        subFoo: { type: 'String' }
      }]
    });
    f.serialize([{ subFoo: 'asdf' }])[0].subfoo.should.equal('asdf');
  });

});
