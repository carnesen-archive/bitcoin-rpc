const { readRpcHref, createBitcoinRpc } = require('.');

const href = readRpcHref();
console.log(href);
// http://__cookie__:00cb71699e6@127.0.0.1:18443/

const bitcoinRpc = createBitcoinRpc(href);

bitcoinRpc('getblockhash', { height: 0 })
  .then(result => {
    console.log(result);
    // 0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206
  })
