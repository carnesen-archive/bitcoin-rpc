'use strict';

const fetch = require('node-fetch');
const { wrap } = require('co');

const constants = require('./constants');
const errors = require('./errors');
const methods = require('./methods');

module.exports = function createCookieClient({ url, rpccookiefile }) {

  const client = {};

  let cookie;

  methods.forEach(method => {

    client[method.name] = wrap(function* (argObject) {

      if (!cookie) {
        cookie = yield readFile(rpccookiefile, { encoding: 'utf8' });
      }

      argObject = argObject || {};

      const argArray = method.params.map(param => {
        const value = argObject[param.name] || param.default;
        if (isUndefined(value)) {
          throw new errors.REQUIRED_PARAMETER(param.name);
        }
      });

      const id = Math.floor(Math.random() * 10000000);

      const body = JSON.stringify({
        id,
        method: method.name.toLowerCase(),
        params: argArray
      });

      const response = yield fetch(url, {
        headers: {
          cookie,
          'content-length': body.length
        },
        body
      });

      return yield response.json();
    });

  });

  return client;

};
