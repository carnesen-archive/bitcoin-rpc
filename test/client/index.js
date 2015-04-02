'use strict';

var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');

var Request = require('../../lib/request');
var Client = require('../../lib/client');

describe('Client', function() {

  var clientMock, requestMock;
  beforeEach(function() {
    requestMock = Request.create();
    clientMock = Client.create();
    clientMock.httpClient = { sendJson: sinon.spy() };
  });

  it('Instantiates from constructor', function() {
    var client = new Client({});
    should.exist(client);
  });

  it('Instantiates from create', function() {
    var client = Client.create();
    should.exist(client);
  });

  it('Instantiates from create with opts', function() {
    var client = Client.create({foo: 'bar'});
    should.exist(client);
  });

  it('sendRequest calls sendJson', function () {
    clientMock.sendRequest(requestMock);
  });

});
