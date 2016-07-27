'use strict';

const { format } = require('url');
const fetch = require('node-fetch');

const errors = require('./errors');
const methods = require('./methods');
const util = require('./util');
const readConf = require('./readConf');

function createClient(passed) {

  const config = readConf(passed);

  const client = {};

  const url = format({ hostname, port });

  methods.forEach(method => {

    client[method.name] = function (argObj) {

      argObj = argObj || {};

      const argArr = method.params.map(param => {
        const value = argObj[param.name] || param.default;
        if (util.isUndefined(value)) {
          throw new errors.REQUIRED_PARAMETER(param.name);
        }
      });

      if (!cookie) {
        try {
          cookie = yield readFile(cookieFile);
        } catch (e) {
          throw errors.NO_COOKIE();
        }
      }

      const id = Math.floor(Math.random() * 10000000);

      const body = JSON.stringify({
        id,
        method: method.name.toLowerCase(),
        params: argArr
      });

      const response = yield fetch(url, {
        headers: {
          cookie,
          'content-type': 'application/json',
          'accepts': 'application/json'
        },
        body
      });

      return yield response.json();
    }
  });

  return client;

}

module.exports = createClient;