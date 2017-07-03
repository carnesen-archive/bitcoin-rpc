'use strict';

const path = require('path')
const {readFileSync} = require('fs');

const {safeLoad} = require('js-yaml');

const specs = safeLoad(readFileSync(path.join(__dirname, 'specs.yml')))

specs.forEach(function (spec) {
  spec.parameters = spec.parameters || []
  spec.parameters.forEach(function (parameter) {
    switch (parameter.name) {
      case 'account':
        parameter.description = 'A wallet account label ("" means the default account)'
        parameter.type = 'string'
        break
      case 'address':
        parameter.description = 'An address in base58check format'
        parameter.type = 'string'
        break
      case 'addresses':
        parameter.description = 'An array of addresses in base58check format'
        parameter.type = 'array'
        parameter.itemType = 'string'
        break
      case 'amount':
        parameter.description = 'Amount in bitcoin'
        parameter.type = 'number'
        break
      case 'block':
        parameter.description = 'A complete block in hex-encoded binary format'
        parameter.type = 'string'
        break
      case 'comment':
        parameter.description = 'A comment to associate with the transaction'
        parameter.type = 'string'
        break
      case 'hash':
        parameter.description = 'A hex-encoded RPC-byte-ordered block header hash'
        parameter.type = 'string'
        break
      case 'host':
        parameter.description = 'A host address (e.g. "54.23.12.0:8333")'
        parameter.type = 'string'
        break
      case 'key':
        parameter.description = 'A base58check-encoded private key'
        parameter.type = 'string'
        break
      case 'height':
        parameter.description = 'A block height (index)'
        parameter.type = 'number'
        break
      case 'includeEmpty':
        parameter.description = 'True to display accounts which have never received a payment'
        parameter.type = 'boolean'
        break
      case 'includeWatchOnly':
        parameter.description = 'Whether (true) or not (false) to include watch-only transactions'
        parameter.type = 'boolean'
        break
      case 'keys':
        parameter.description = 'An array of base58check-encoded private keys'
        parameter.type = 'array'
        parameter.itemType = 'string'
        break
      case 'minConfirmations':
        parameter.description = 'Minimum number of confirmations for a transaction to be included in the calculation'
        parameter.type = 'number'
        break
      case 'message':
        parameter.description = 'A string message, e.g. "Hello World!"'
        parameter.type = 'string'
        break
      case 'passphrase':
        parameter.description = 'A secret used to encrypt the wallet'
        parameter.type = 'string'
        break
      case 'rescan':
        parameter.description = 'Whether (true) or not (false) to rescan transactions'
        parameter.type = 'boolean'
        break
      case 'script':
        parameter.description = 'A serialized redeem script'
        parameter.type = 'string'
        break
      case 'transaction':
        parameter.description = 'A hex-encoded binary transaction'
        parameter.type = 'string'
        break
      case 'txid':
        parameter.description = 'A hex-encoded RPC-byte-ordered transaction hash digest'
        parameter.type = 'string'
        break
      case 'txids':
        parameter.description = 'An array of hex-encoded RPC-byte-ordered transaction hash digests'
        parameter.type = 'array'
        parameter.itemType = 'string'
        break
      case 'txOutProof':
        parameter.description = 'A hex-encoded serialized proof'
        parameter.type = 'string'
        break
      case 'vout':
        parameter.description = 'Index of a transaction output'
        parameter.type = 'number'
        break
      case 'verbose':
        parameter.description = 'Whether to return an object or serialized data'
        parameter.type = 'boolean'
        break
    }
  })
})

module.exports = specs
