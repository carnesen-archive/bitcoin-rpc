import { createCliRpc } from './cli-client';
import { createRpc } from './client';
import { runAndExit } from '@carnesen/run-and-exit';

const cliRpc = createCliRpc();
const rpc = createRpc({
  rpcuser: 'carnesen',
  rpcpassword: '12345678',
  rpcport: '12345',
});

runAndExit(async () => {
  const result = await rpc('getblockcount');
  debugger;
  return result;
});
