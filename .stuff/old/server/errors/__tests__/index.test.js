
const errors = require('../index');
const specs = require('../specs');

describe('errors', function() {

  Object.keys(specs).forEach(code => {
    const message = specs[code];
    it(code, function() {
      const error = new errors[code]();
      error.code.should.equal(code);
      error.message.should.equal(message);
    });
  })

});
