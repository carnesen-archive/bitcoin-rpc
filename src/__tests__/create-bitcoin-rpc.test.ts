import { createBitcoinRpc } from '../create-bitcoin-rpc';
import { readRpcHref } from '../read-rpc-href';

const href = readRpcHref();
const bitcoinRpc = createBitcoinRpc(href);

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

  it('getblockcount', async () => {
    const result = await bitcoinRpc('getblockcount');
    expect(typeof result).toBe('number');
  });

  it('getblockcount', async () => {
    const result = await bitcoinRpc('getblockcount');
    expect(typeof result).toBe('number');
  });

  it('getbestblockhash', async () => {
    const result = await bitcoinRpc('getbestblockhash');
    expect(typeof result).toBe('string');
  });

  it('getblockhash', async () => {
    const result = await bitcoinRpc('getblockhash', [0]);
    expect(typeof result).toBe('string');
  });
});
