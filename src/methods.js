'use strict';

const { join } = require('path');
const { readdirSync, readFileSync } = require('fs');
const { safeLoad } = require('js-yaml');

const ymlDir = join(__dirname, 'yml');

const methods = [];

readdirSync(ymlDir).forEach(fileName => {
  const { methodMap, group } = safeLoad(readFileSync(join(ymlDir, fileName)));
  Object.keys(methodMap).forEach(name => {
    methods.push(Object.assign(methodMap[name]), { group, name });
  })
});

module.exports = methods;
