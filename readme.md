# @carnesen/bitcoin-rpc [![npm version](https://badge.fury.io/js/%40carnesen%2Fbitcoin-rpc.svg)](https://badge.fury.io/js/%40carnesen%2Fbitcoin-rpc) [![Build Status](https://travis-ci.org/carnesen/bitcoin-rpc.svg?branch=master)](https://travis-ci.org/carnesen/bitcoin-rpc)

A Node.js client for bitcoin's remote procedure call (RPC) interface. This package includes runtime JavaScript files suitable for Node.js >=8 as well as the corresponding TypeScript type declarations.

## Usage

```ts
const { createBitcoinRpc } = require('@carnesen/bitcoin-rpc');

const rpcuser = 'carnesen';
const rpcpassword = 'password';
const rpcHref = `http://${rpcuser}:${rpcpassword}@127.0.0.1:18443/`;
const bitcoinRpc = createBitcoinRpc(href);

bitcoinRpc('getblockhash', { height: 0 })
  .then(result => {
    // 0f9188f13cb7b2c71f2a335e3a4f
  })
```

## API

### `createBitcoinRpc(href): bitcoinRpc`
A factory function for creating bitcoin RPC clients

#### `href`
A string of the form `http://<username>:<password>@<hostname>:<port>/` as defined by the [WHATWG URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api) standard. The href can be passed to `createBitcoinRpc` to create an RPC client. 

### `bitcoinRpc(method, params): Promise<result>`
This section documents the function returned by `createBitcoinRpc`. 

#### `method`
`string`. The name of an RPC method, e.g. `getnetworkinfo`.

#### `params`
Optional for some methods. An array of positional parameter values or an object of "named" parameter values for the specified `method`.

#### `result`
`any`. The remote procedure call's result.

## Related
- [@carnesen/bitcoin-rpc-href](https://github.com/carnesen/bitcoin-rpc-href): A Node.js library for reading bitcoin's remote procedure call (RPC) configuration
- [@carnesen/bitcoin-config](https://github.com/carnesen/bitcoin-config): A Node.js library for bitcoin server software configuration
- [@carnesen/bitcoin-service](https://github.com/carnesen/bitcoin-service): A Node.js library for managing the bitcoin service `bitcoind`
- [@carnesen/bitcoin-software](https://github.com/carnesen/bitcoin-software): A Node.js library for installing bitcoin server software

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
