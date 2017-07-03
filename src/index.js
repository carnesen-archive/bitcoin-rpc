'use strict'

const clientFactory = require('./clientFactory')
const specs = require('./specs')

Object.assign(clientFactory, {specs})

module.exports = clientFactory
