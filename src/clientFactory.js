'use strict';

const path = require('path')

const axios = require('axios')
const ini = require('ini')
const status = require('statuses')
const uuid = require('uuid/v4')

const {readFile} = require('@carnesen/node-util')
const {
  assertNonEmptyObject,
  assertNonEmptyString,
  createTypeError,
  isDefined,
  isEmptyObject,
} = require('@carnesen/util')

const {ERROR_CODES} = require('./constants')
const specs = require('./specs')
const {debug} = require('./util')

module.exports = function clientFactory (options = {}) {
  debug('clientFactory:start')
  assertNonEmptyObject(options, 'options')
  const {
    url,
    cookieFile,
    confFile,
    username,
    password,
  } = options
  assertNonEmptyString(url, 'options.url')
  
  let getAuth
  if (isDefined(cookieFile)) {
    assertNonEmptyString(cookieFile, 'options.cookieFile')
    assertExclusive(username, 'cookieFile', 'username')
    assertExclusive(password, 'cookieFile', 'password')
    assertExclusive(password, 'cookieFile', 'confFile')
    getAuth = async function () {
      const contents = await readFile(cookieFile, {encoding: 'utf8'})
      const [username, password] = contents.split(':')
      return {username, password}
    }
  } else if (isDefined(confFile)) {
    assertNonEmptyString(confFile, 'options.confFile')
    assertExclusive(username, 'confFile', 'username')
    assertExclusive(password, 'confFile', 'password')
    getAuth = async function () {
      const contents = await readFile(confFile, {encoding: 'utf8'})
      const {rpcuser, rpcpassword} = ini.parse(contents)
      return {username: rpcuser, password: rpcpassword}
    }
  } else if (isDefined(username) && isDefined(password)) {
    assertNonEmptyString(username, 'username')
    assertNonEmptyString(password, 'password')
    getAuth = async function () {
      return {username, password}
    }
  } else {
    throw new Error('Expected options to contain "cookieFile", "confFile", or "username" and "password"')
  }

  let auth
  const client = {}
  specs.forEach(function (method) {
    client[method.name] = async function (argObject) {
      debug(`client.${method.name}:start`)
      const argArray = getArgArray(method, argObject)
      if (!auth) {
        await setAuth()
      }

      let result
      try {
        result = await callRemoteProcedure()
      } catch (ex) {
        if (ex.code === ERROR_CODES.UNAUTHORIZED) {
          // Presume bitcoin server restarted and we need to re-setAuth
          await setAuth()
          result = await callRemoteProcedure()
        } else {
          throw ex
        }
      }

      debug(`client.${method.name}:end`)
      return result

      async function setAuth () {
        try {
          auth = await getAuth()
        } catch (ex) {
          debug('loadAuth failed', ex)
          const err = new Error(ex.message || 'Failed to load auth')
          err.code = ERROR_CODES.NO_AUTH
          throw err
        }
      }

      async function callRemoteProcedure() {
        const id = uuid()
        let data
        try {
          const response = await axios({
            url,
            method: 'POST',
            data: {
              method: method.name.toLowerCase(),
              id,
              params: argArray,
            },
            auth,
          })
          data = response.data
        } catch (ex) {
          const {response} = ex
          if (response && response.status === status('unauthorized')) {
            const err = new Error('Server responded "unauthorized" (401)')
            err.code = ERROR_CODES.UNAUTHORIZED
            throw err
          } else {
            throw ex
          }
        }
        if (data.id !== id) {
          throw Error(`Expected result.id to equal query.id`)
        }
        const {result, error} = data
        if (error) {
          throw error
        }
        return result
      }
    }
  })

  debug('clientFactory:end')
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
