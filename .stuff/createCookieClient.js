'use strict';

const nodeFetch = require('node-fetch');
const { wrap } = require('co');

const fs = require('@carnesen/fs');
const util = require('@carnesen/util');

const constants = require('./constants');
const methods = require('./methods');
const log = require('./log');

module.exports = function createCookieClient({ url, rpccookiefile, fetch = nodeFetch }) {

  log.debug(`createCookieClient: url = ${ url }; rpccookiefile = ${ rpccookiefile }`);

  const client = {};

  methods.forEach(method => {

    client[method.name] = wrap(function* (argObject) {

      argObject = argObject || {};

      log.debug(`${ method.name }`);

      log.debug(`${ method.name }: reading cookie file`);
      const cookie = yield fs.readFile(rpccookiefile, { encoding: 'utf8' });

      const argArray = method.parameters.map(parameter => {
        const value = argObject[parameter.name] || parameter.default;
        if (util.isUndefined(value)) {
          throw new Error(`${ parameter.name } to have a value`);
        }
      });

      const id = Math.floor(Math.random() * 10000000);

      const body = JSON.stringify({
        id,
        method: method.name.toLowerCase(),
        parameters: argArray
      });

      log.debug(`${ method.name }: fetching`);
      const response = yield fetch(url, {
        headers: {
          cookie,
          'content-length': body.length
        },
        body
      });

      log.debug(`${ method.name }: parsing response`);
      return yield response.json();
    });

  });

  return client;

};
