import { BitcoinRpcClient } from '.';

const bitcoinRpcClient = new BitcoinRpcClient({
  hostname: 'localhost',
  port: 18332,
  username: '__cookie__',
  password: '70b27913e8b9ceb69d9961b4f84e586c77572852a0604e8af68cae39e75ba571',
});

(async () => {
  try {
    // const response = await bitcoinRpcClient.getBlockHash({ height: 1 });
    const response = await bitcoinRpcClient.getBlock({
      blockhash: '00000000000000ac03320e1cab17dfc7d9f64e5ab8b4550d74c7c9a1210aa23a',
      verbose: 0,
    });
    console.log(response);
    process.exit();
  } catch (ex) {
    // debugger;
    setTimeout(() => {
      throw ex;
    }, 0);
  }
})();
