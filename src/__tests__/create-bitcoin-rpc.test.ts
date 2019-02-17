import { RegtestService } from '@carnesen/bitcoin-regtest-service';
import { resolve } from 'path';

import { createBitcoinRpc } from '../create-bitcoin-rpc';

export const datadir = resolve(__dirname, '..', '..', 'tmp');
export const regtestService = new RegtestService({ datadir });

const bitcoinRpc = createBitcoinRpc(regtestService.rpcHref);

async function catchBitcoinRpc(...args: Parameters<typeof bitcoinRpc>) {
  try {
    await bitcoinRpc(...args);
    throw new Error('This line should not be reached');
  } catch (ex) {
    return ex;
  }
}

describe(bitcoinRpc.name, () => {
  beforeAll(async () => {
    await regtestService.start();
    // service takes a little time to bind to the rpc port
    await new Promise(resolve => {
      setTimeout(resolve, 3000);
    });
  }, 30000);

  afterAll(() => regtestService.stop());

  it('getnetworkinfo', async () => {
    const result = await bitcoinRpc('getnetworkinfo');
    expect(result.connections).toBe(0);
  });

  it('getblockcount', async () => {
    const result = await bitcoinRpc('getblockcount');
    expect(result).toBe(0);
  });

  it('getblockcount', async () => {
    const result = await bitcoinRpc('getblockcount');
    expect(result).toBe(0);
  });

  it('getbestblockhash', async () => {
    const result = await bitcoinRpc('getbestblockhash');
    expect(result).toBe(
      '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
    );
  });

  it('getblockhash', async () => {
    const result = await bitcoinRpc('getblockhash', [0]);
    expect(result).toBe(
      '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
    );
  });

  it('rejects a 404-coded error on unknown method', async () => {
    const ex = await catchBitcoinRpc('foo');
    expect(ex.code).toBe(404);
  });
});
