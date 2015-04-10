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
});

describe('requests', function() {

  var requests = new Requests();

  function checkRequestsMethod(method) {
    var fn = function() {
      var args = method.params.map(function() { return ''});
      requests[method.name](args);
    };
    fn.should.not.throw();
  }

  methods.forEach(function(method) {
    it(method.name, function() { checkRequestsMethod(method); })
  });

});
