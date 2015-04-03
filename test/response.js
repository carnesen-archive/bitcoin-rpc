'use strict';

var chai = require('chai');
var should = chai.should();

var Response = require('../lib/response');

describe('Response', function() {

  var responseMock;
  beforeEach(function() {
    responseMock = Response.create({
      error: null,
      result: '',
      id: '1234'
    });
  });

  it('instantiates from constructor', function() {
    var response = new Response();
    should.exist(response);
  });

  it('instantiates from create', function() {
    should.exist(responseMock);
  });

  it('set id', function() {
    responseMock.id.should.equal('1234');
  });

  it('creates Error instance if response contains error', function() {
    var response = Response.create({error: {message: 'bad', code: 911}});
    response.error.should.be.instanceof(Error);
    response.error.message.should.equal('911: bad');
  });

});
