import { createBitcoinRpc } from '../create-bitcoin-rpc';
import { readRpcHref } from '../read-rpc-href';

const href = readRpcHref();
const bitcoinRpc = createBitcoinRpc(href);

export const BLOCK_HASH =
  '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206';

export const BLOCK_COUNT = 0;

async function catchBitcoinRpc(...args: Parameters<typeof bitcoinRpc>) {
  try {
    await bitcoinRpc(...args);
    throw new Error('This line should not be reached');
  } catch (ex) {
    return ex;
  }
}

describe(bitcoinRpc.name, () => {
  it('rejects a coded error if server returns 404', async () => {
    const ex = await catchBitcoinRpc('foo');
    expect(ex.code).toBe(404);
  });

  it('getnetworkinfo', async () => {
    const result = await bitcoinRpc('getnetworkinfo');
    expect(typeof result.connections).toBe('number');
  });
});
