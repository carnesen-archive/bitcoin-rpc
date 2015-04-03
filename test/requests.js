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

  it('method-created request calls back error', function() {
    var request = requestsMock.Foo(['beef'], function(err) {
      return(err);
    });
    request.callback('foo').should.equal('foo');
  });

  it('method-created request calls back deserialized result', function() {
    var request = requestsMock.Foo(['beef'], function(err, ret) {
      return(ret);
    });
    request.callback(null, 'beef').toString('hex').should.equal('beef');
  });

  it('requests method should set method name properly', function() {
    requestsMock.Foo(['beef']).method.should.equal('Foo');
  });

});
