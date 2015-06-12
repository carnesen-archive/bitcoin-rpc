'use strict';

var should = require('chai').should();

var Method = require('../../lib/method');

describe('Method', function() {

  var m;
  beforeEach(function() {
    m = new Method('GetFoo');
  });

  it('instantiates from constructor', function() {
    should.exist(m);
  });

  it('instantiates from create', function() {
    m = Method.create('GetFoo');
    should.exist(m)
  });

});
