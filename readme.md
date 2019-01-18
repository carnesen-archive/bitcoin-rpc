# @carnesen/bitcoin-rpc

## Install

```
npm install @carnesen/bitcoin-rpc
```

## Usage
Continuing that example, you can take `config` and pass it into the `getRpcHref` utility function to get a complete "href" connection string for bitcoin's remote procedure call (RPC) interface:

```ts
const href = getRpcHref(config);
console.log(href);
// http://__cookie__:53a85a58f9d825b1@1.2.3.4:33333/
```

The format of that "href" string is `http://<username>:<password>@<hostname>:<port>/` as defined by the [WHATWG URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api) standard. In Node.js >=8, you can parse it as `new require('url').URL(href)`. In Node.js >=10, `URL` is defined globally and it's as easy as `new URL(href)`.

## API

Returns a [URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api) "href" string that can be used to connect to bitcoind's http remote procedure call (RPC) interface. The logic in this function is meant to reproduce as closely as possible that of the bitcoin-cli client that ships with the bitcoin server software. Among other things, if the config object does not contain an `rpcpassword`, that means that "cookie-based" authentication is enabled. In that case `getRpcHref` reads the username and password from the `rpccookiefile` file written to `datadir` on startup.

