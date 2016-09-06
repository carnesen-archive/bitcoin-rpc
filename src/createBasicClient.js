'use strict';

const fetch = require('node-fetch');

const errors = require('./errors');
const methods = require('./methods');

function base64Encode(input) {
  return new Buffer(input, 'utf8').toString('base64')
}

module.exports = function createBasicClient({ url, rpcuser, rpcpassword }) {

  const client = {};

  methods.forEach(method => {

    client[method.name] = function (argObj) {

      argObj = argObj || {};

      const argArr = method.params.map(param => {
        const value = argObj[param.name] || param.default;
        if (util.isUndefined(value)) {
          throw new errors.REQUIRED_PARAMETER(param.name);
        }
      });

      const id = Math.floor(Math.random() * 10000000);

      const body = JSON.stringify({
        id,
        method: method.name.toLowerCase(),
        params: argArr
      });

      const response = yield fetch(url, {
        headers: {
          cookie,
          'accepts': 'application/json',
          'content-type': 'application/json',
          'content-length': body.length
        },
        body
      });

      return yield response.json();
    }
  });

  return client;

};
