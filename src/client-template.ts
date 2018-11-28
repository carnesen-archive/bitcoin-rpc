// This file is generated programmatically. Do not edit.

import { JsonRpcClient, JsonRpcParams } from '../../../json-rpc';

import * as GetBlock2 from './get-block_verbosity-2';
import * as GetBestBlockHash from './get-best-block-hash';

export class BitcoinRpcClient {
  private readonly jsonRpcClient: JsonRpcClient;

  constructor(href: string) {
    this.jsonRpcClient = new JsonRpcClient(href);
  }

  public async rpc<R>(method: string, params?: JsonRpcParams) {
    const result: R = await this.jsonRpcClient.rpc(method, params);
    return result;
  }
  public getBestBlockHash() {
    return this.rpc<GetBestBlockHash.Example['result']>('getbestblockhash');
  }
  public getBlock2(params: GetBlock2.Example['params']) {
    return this.rpc<types.GetBlockResult<V>>('getblock', params);
  }
  // public getBlockHash(params: types.GetBlockHashParams) {
  //   return this.rpc<types.GetBlockHashResult>('getblockhash', params);
  // }
  // public getNetworkInfo() {
  //   return this.rpc<types.GetNetworkInfoResult>('getnetworkinfo');
  // }
  // public getWalletInfo() {
  //   return this.rpc<types.GetWalletInfoResult>('getwalletinfo');
  // }
}
export { GetBlockVerbosity2 };
