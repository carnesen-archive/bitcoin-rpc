'use strict';

var should = require('chai').should();

var Requests = require('../lib/requests');
var Request = require('../lib/request');
var Spec = require('../lib/spec/index');

describe('Requests', function() {

  var requestsMock, specMock;
  beforeEach(function() {
    specMock = new Spec();
    specMock.loadMethodGroup({
      groups: [],
      methods: [{
        name: 'Foo',
        params: [{ name: 'P', type: 'Hash'}],
        result: 'Hash'
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
    var fn = function() { requestsMock.Foo(['beef']) };
    fn.should.not.throw();
  });

  it('requests method should return a Request instance', function() {
    requestsMock.Foo(['beef']).should.be.an.instanceof(Request);
  });

  //it('requests method should set up proper result handler', function() {
  //  var result = requestsMock.Foo(['beef']).callback('beef');
  //  result.should.be.an.instanceof(Buffer);
  //  result.toString('hex').should.equal('beef');
  //});
  //
  it('requests method should set method name properly', function() {
    requestsMock.Foo(['beef']).method.should.equal('Foo');
  });

});
