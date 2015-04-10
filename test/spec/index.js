'use strict';

var chai = require('chai');
var should = chai.should();

var spec = require('../../lib/spec');

describe('spec', function() {

  it('exports methods', function() {
    should.exist(spec.methods)
  });

  it('exports Response', function() {
    should.exist(spec.Response)
  });

  it('exports Request', function() {
    should.exist(spec.Request)
  });

});
