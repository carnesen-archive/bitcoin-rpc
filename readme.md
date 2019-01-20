# @carnesen/bitcoin-rpc

A Node.js client for bitcoin's remote procedure call (RPC) interface

## Install

```
npm install @carnesen/bitcoin-rpc
```
This package includes runtime JavaScript files suitable for Node.js >=8 as well as the corresponding TypeScript type declarations.

## Usage

```ts
const { readRpcHref, createBitcoinRpc } = require('@carnesen/bitcoin-rpc');

const href = readRpcHref();
console.log(href);
// http://__cookie__:aaabbb@127.0.0.1:18443/

const bitcoinRpc = createBitcoinRpc(href);

bitcoinRpc('getblockhash', { height: 0 })
  .then(result => {
    console.log(result);
    // 0f9188f13cb7b2c71f2a335e3a4f
  })
```

## API

### readRpcHref(configFilePath): href
Reads bitcoin configuration files to determine an "href" connection string for the RPC interface. The logic in this function is meant to reproduce as closely as possible that of the `bitcoin-cli` client that ships with the bitcoin server software. Among other things, if the configuration does not contain an `rpcpassword`, that means that "cookie-based" authentication is enabled. In that case `readRpcHref` reads the username and password from the `rpccookiefile` file written to `datadir` on startup.

#### configFilePath
Optional. String path of a bitcoin configuration file. Default value is the platform-dependent location where bitcoin looks for its config file e.g. `~/.bitcoin/bitcoin.conf` on Linux.

#### href
A string of the form `http://<username>:<password>@<hostname>:<port>/` as defined by the [WHATWG URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api) standard. The href can be passed to `createBitcoinRpc` to create an RPC client. 

### createBitcoinRpc(href): bitcoinRpc
A factory function for creating bitcoin RPC clients

#### href
As above ^^

### bitcoinRpc(method, params): result
This section documents the function returned by `createBitcoinRpc`. 

#### method
A string specifying the name of an RPC method, e.g. `getnetworkinfo`.

#### params
Optional. An array of positional parameter values for the specified `method` or an object of "named" parameter values, if required by the method.

