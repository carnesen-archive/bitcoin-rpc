import { createBitcoinRpc } from './bitcoin-rpc';
import { createBitcoinCliRpc } from './bitcoin-cli';
import { RpcServer, ERROR_CODES } from './server';
import { RpcOptions, BitcoinRpc } from './types';

const options: RpcOptions = {
  rpcport: '55438',
  rpcuser: 'not a real user',
  rpcpassword: 'not a real password',
};

const bitcoinRpc = createBitcoinRpc(options);
const bitcoinCliRpc = createBitcoinCliRpc(options);
const server = new RpcServer(options);

const testBoth = (name: string, func: (sendRpcX: BitcoinRpc) => any) => {
  [bitcoinRpc, bitcoinCliRpc].forEach(sendRpcX => {
    it(`${sendRpcX.name}: ${name}`, () => func(sendRpcX));
  });
};

describe('sendRpc', () => {
  beforeAll(() => server.start());
  afterAll(() => server.stop());
  testBoth('rejects a coded error if server returns an RpcError', async sendRpcX => {
    try {
      await sendRpcX('not a real method name');
      throw new Error('This line should not be reached');
    } catch (ex) {
      expect(ex.code).toBe(ERROR_CODES.METHOD_NOT_FOUND);
    }
  });
});
