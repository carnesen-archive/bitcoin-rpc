import { createRpc } from './client';
import { RpcServer } from './server';
import { RpcOptions } from './types';

const options: RpcOptions = {
  rpcport: '55438',
  rpcuser: 'not a real user',
  rpcpassword: 'not a real password',
};

const rpc = createRpc(options);
const server = new RpcServer(options);

describe('BitcoinRpcClient#rpc', () => {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  it('resolves a string', async () => {
    await rpc('foo');
  });
});
