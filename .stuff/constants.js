'use strict';

const { moduleName } = require('../package.json');

module.exports = {

  moduleName,

  headers: {
    'accepts': 'application/json',
    'content-type': 'application/json'
  }

};
