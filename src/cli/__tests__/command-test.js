const {assertCommand} = require('@carnesen/cli')

const command = require('../command')

describe(__filename, function () {
  it.only('command is valid', function () {
    assertCommand(command)
  })
})
