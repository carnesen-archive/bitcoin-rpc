'use strict'

const keyMirror = require('keymirror')

const ERROR_CODES = keyMirror({
  UNAUTHORIZED: null,
  NO_AUTH: null,
})

module.exports = {
  ERROR_CODES,
}