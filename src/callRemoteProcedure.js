'use strict'

const axios = require('axios')
const uuid = require('uuid/v4')

module.exports = async function ({url, auth, methodName, parameterValues}) {
  const response = await axios({
    url,
    method: 'post',
    data: {
      method: methodName,
      id: uuid(),
      parameterValues
    },
    auth,
  })
}
