'use strict';

var should = require('chai').should();

var Requests = require('../lib/requests');
var methods = require('../lib/spec/methods');

describe('Requests', function() {

  it('instantiates from constructor', function () {
    var r = new Requests();
    should.exist(r);
  });

  it('instantiates from create', function () {
    var r = Requests.create();
    should.exist(r);
  });

  it('asdf', function () {
    var r = Requests.create();
    r.GetInfo()
  });

});
