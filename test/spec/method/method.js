'use strict';

var should = require('chai').should();

var Method = require('../../../lib/spec/method/index');

describe('Method', function() {

  var methodMock, objMock, groupMock;
  beforeEach(function() {
    objMock = {
      name: 'GetFoo',
      result: 'String'
    };
    groupMock = {
      name: 'Stuff',
      public: false
    };
    methodMock = new Method(objMock, groupMock);
  });

  it('instantiates from constructor', function() {
    should.exist(methodMock);
  });

  it('instantiates from create', function() {
    var method = Method.create(objMock, groupMock);
    should.exist(method)
  });

  it('uses group public setting if none is provided in object', function () {
    methodMock.public.should.equal(groupMock.public);
  });

  it('has params.length === 0 if not provided in spec', function () {
    methodMock.params.should.have.length(0);
  });

  it('can override group-level public setting', function () {
    var method = Method.create({public: 'yes'},groupMock);
    method.public.should.equal(true);
  });

  it('throws Invalid Argument if no arguments are provided', function () {
    Method.create.should.throw('Invalid Argument');
  });

});
