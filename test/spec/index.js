'use strict';

var chai = require('chai');
var should = chai.should();

var Spec = require('../../lib/spec');

describe('Spec', function() {

  var specMock;
  beforeEach(function() {
    specMock = new Spec();
  });

  it('instantiates from constructor', function() {
    should.exist(specMock)
  });

  it('instantiates from create', function() {
    var spec = Spec.create();
    should.exist(spec)
  });

  it('has no methods or groups by default', function() {
    specMock.methods.should.have.length(0);
    specMock.groups.should.have.length(0);
  });

  it('can load a method group', function() {
    specMock.loadMethodGroup({
      group: { name: 'asdf', description: 'fdsa' },
      methods: [
        { name: 'mfoo'}
      ]
    })
  });
});
