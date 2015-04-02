'use strict';

var should = require('chai').should();

var Requests = require('../lib/requests');
var Spec = require('../lib/spec/index');

describe('Requests', function() {

  var requestsMock, specMock;
  beforeEach(function() {
    specMock = new Spec();
    specMock.loadMethodGroup({
      groups: [],
      methods: [{
        name: 'Foo'
      }]
    });
    requestsMock = new Requests(specMock);
  });

  it('instantiates from constructor', function() {
    should.exist(requestsMock);
  });

  it('instantiates from create', function() {
    var requests = Requests.create();
    should.exist(requests);
  });

  it('creates a requests method for each method provided ', function() {
    requestsMock.Foo.should.be.a('function')
  });

});
