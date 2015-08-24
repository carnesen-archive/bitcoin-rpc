'use strict';

require('simple-syrup-dev').should();

var Params = require('../params');

describe('Params', function() {

  var paramsMock = Params.create([{
    name: 'foo',
    type: 'Hash'
  }]);

  it('serializes', function() {
    paramsMock.serialize('beef', 'pie')[0].should.equal('beef');
  });

});
