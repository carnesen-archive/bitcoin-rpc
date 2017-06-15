'use strict';

const path = require('path')
const {readFileSync} = require('fs');

const axios = require('axios')
const ini = require('ini')
const {safeLoad} = require('js-yaml');
const uuid = require('uuid/v4')

const {readFile} = require('@carnesen/node-util')
const {
  assertNonEmptyObject,
  assertNonEmptyString,
  createTypeError,
  isDefined,
  isEmptyObject,
} = require('@carnesen/util')

const methods = safeLoad(readFileSync(path.join(__dirname, 'methods.yml')))

function clientFactory (options = {}) {
  assertNonEmptyObject(options, 'options')
  const {
    url,
    cookieFile,
    confFile,
    username,
    password,
  } = options
  assertNonEmptyString(url, 'options.url')
  
  let loadAuth
  if (isDefined(cookieFile)) {
    assertNonEmptyString(cookieFile, 'options.cookieFile')
    assertExclusive(username, 'cookieFile', 'username')
    assertExclusive(password, 'cookieFile', 'password')
    assertExclusive(password, 'cookieFile', 'confFile')
    loadAuth = async function () {
      const contents = await readFile(cookieFile, {encoding: 'utf8'})
      const [username, password] = contents.split(':')
      return {username, password}
    }
  } else if (isDefined(confFile)) {
    assertNonEmptyString(confFile, 'options.confFile')
    assertExclusive(username, 'confFile', 'username')
    assertExclusive(password, 'confFile', 'password')
    loadAuth = async function () {
      const contents = await readFile(confFile, {encoding: 'utf8'})
      const {rpcuser, rpcpassword} = ini.parse(contents)
      return {username: rpcuser, password: rpcpassword}
    }
  } else if (isDefined(username) && isDefined(password)) {
    assertNonEmptyString(username, 'username')
    assertNonEmptyString(password, 'password')
    loadAuth = async function () {
      return {username, password}
    }
  } else {
    throw new Error('Expected options to contain "cookieFile", "confFile", or "username" and "password"')
  }

  let auth
  async function callRemoteProcedure({methodName, argArray}) {
    const response = await axios({
      url,
      method: 'post',
      data: {
        method: methodName,
        id: uuid(),
        params: argArray,
      },
      auth,
    })
  }

  const client = {}

  methods.forEach(function (method) {

    client[method.name] = async function (argObject) {

      if (!auth) {
        auth = await loadAuth()
      }
      const response = await axios({
        url,
        method: 'post',
        data: {
          method: methodName,
          id: uuid(),
        },
        auth,
      })
    }
  })

  return client
}

function assertExclusive(value, definedName, shouldBeUndefinedName) {
  if (isDefined(value)) {
    throw createTypeError(`options.${shouldBeUndefinedName}`, `absent if options.${definedName} is provided`)
  }
}

function getArgArray(method, argObject = {}) {
  const {parameters = []} = method
  if (parameters.length === 0 && !isEmptyObject(argObject)) {
    throw new Error(`Method "${method.name}" does not have parameters`)
  }
  const argArray = []
  parameters.forEach(function (parameter) {

  })
  return argArray
}

clientFactory.methods = methods

module.exports = clientFactory
