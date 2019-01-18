import { cli, leaf, option } from '@carnesen/cli';
import { createBitcoinRpc } from './create-bitcoin-rpc';
import { readRpcHref } from './read-rpc-href';

const rootCommand = leaf({
  commandName: 'bitcoin-rpc',
  description: 'Bitcoin remote procedure call (RPC)',
  options: {
    method: option({
      typeName: 'string',
      description: 'Method name',
    }),
    params: option({
      typeName: 'json',
      description: 'Named or positional params',
      defaultValue: [],
    }),
  },
  async action({ method, params }) {
    const href = readRpcHref();
    const bitcoinRpc = createBitcoinRpc(href);
    const result = bitcoinRpc(method, params);
    return result;
  },
});

if (module === require.main) {
  cli(rootCommand);
}
