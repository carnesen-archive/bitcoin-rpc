'use strict'

const {camelCase, kebabCase} = require('@carnesen/util')
const {TYPES} = require('@carnesen/cli')

const specs = require('../specs')
const clientFactory = require('../clientFactory')

const subcommands = specs.filter(spec => spec.name !== 'help').map(function (spec) {
  const subcommand = {
    name: kebabCase(spec.name),
    description: spec.description,
    execute (input, {bitcoinRpc}) {
      return bitcoinRpc[spec.name](input)
    },
  }

  if (spec.parameters) {
    subcommand.parameters = spec.parameters.map(function (specParameter) {
      return {
        name: kebabCase(specParameter.name),
        description: specParameter.description,
        type: specParameter.type,
        itemType: specParameter.itemType,
        required: false,
      }
    })
  }

  return subcommand
})

module.exports = {
  name: 'bitcoin-rpc',
  description: 'Make bitcoin remote procedure calls (RPC)',
  parameters: [
    {
      name: 'cookie-file',
      description: 'Path to the RPC "cookie" file',
      type: TYPES.string,
    },
    {
      name: 'url',
      description: 'URL of the RPC server',
      type: TYPES.string,
    }
  ],
  execute(input) {
    return clientFactory(input)
  },
  subcommands,
}