'use strict';

var chai = require('chai');
var should = chai.should();

var Response = require('../../lib/spec/response');
var Request = require('../../lib/spec/request');
var Method = require('../../lib/spec/method');

describe('Response', function() {

  var responseMock, requestMock;
  beforeEach(function() {
    var objMock = {
      name: 'GetFoo',
      result: 'String'
    };
    var groupMock = {
      name: 'Stuff',
      public: false
    };
    var methodMock = new Method(objMock, groupMock);
    requestMock = new Request({method: methodMock});
    responseMock = Response.create(requestMock);
  });

  it('instantiates from constructor', function() {
    var response = new Response(requestMock);
    should.exist(response);
  });

  it('instantiates from create', function() {
    should.exist(responseMock);
  });

  it('sets id', function() {
    responseMock.id.should.equal(requestMock.id);
  });

  describe('deserialize', function() {
    it('sets error if response contains error', function() {
      responseMock.deserialize({error: {message: 'bad', code: 911}});
      responseMock.error.should.equal('911: bad');
    });

    it('sets error "Invalid response" if response ID differs from request', function() {
      responseMock.deserialize({id: null});
      responseMock.error.should.contain('Invalid response');
    });

    it('sets result if no error', function() {
      responseMock.deserialize({id: responseMock.id, result: 'bar'});
      responseMock.result.should.equal('bar');
    });

    it('sets result to null on error', function() {
      responseMock.deserialize({id: 'not 1234', result: 'bar'});
      true.should.equal(responseMock.result === null);
    });
  })
});
