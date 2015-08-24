'use strict';

require('simple-syrup-dev').should();

var methods = require('../spec');
var Requests = require('../requests');

describe('Requests', function() {

  it('spot check GetInfo', function () {
    var r = Requests.create();
    r.GetInfo()
  });

});
