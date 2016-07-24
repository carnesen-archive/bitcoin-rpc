'use strict';

const createClient = require('./createClient');

Object.assign(createClient, {
  constants: require('./constants'),
  methods: require('./methods'),
  util: require('./util')
});

module.exports = createClient;
