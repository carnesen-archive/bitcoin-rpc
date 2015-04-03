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

  it('instantiates from create with directory', function() {
    var spec = Spec.create(__dirname);
    spec.methods.should.have.length(0);
    spec.groups.should.have.length(0);
  });

  it('loads all the yml methods and groups by default', function() {
    specMock.methods.should.have.length.above(0);
    specMock.groups.should.have.length.above(0);
  });

});
