'use strict';

var should = require('chai').should();

var methods = require('../lib/spec');
var Requests = require('../lib/requests');

describe('Requests', function() {

  it('instantiates from constructor', function () {
    var r = new Requests();
    should.exist(r);
  });

  it('instantiates from create', function () {
    var r = Requests.create();
    should.exist(r);
  });

  it('spot check GetInfo', function () {
    var r = Requests.create();
    r.GetInfo()
  });

});
