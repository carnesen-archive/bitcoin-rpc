'use strict';

const { join } = require('path');
const { readdirSync, readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');

const ymlDir = join(__dirname, 'yml');

const methods = [];

readdirSync(ymlDir).forEach(fileName => {
  const { methodMap } = safeLoad(readFileSync(join(ymlDir, fileName)));
  Object.keys(methodMap).forEach(name => {
    const method = methodMap[name];
    Object.assign(method, {
      name,
      params: method.params || []
    });
    methods.push(method);
  })
});

module.exports = methods;
