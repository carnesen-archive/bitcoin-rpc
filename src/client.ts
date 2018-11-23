import { JsonRpcClient } from './json-rpc';

export class BitcoinRpcClient {
  private readonly jsonRpcClient: JsonRpcClient;

  constructor(href: string) {
    this.jsonRpcClient = new JsonRpcClient(href);
  }

  public rpc<P, R>(method: string, params: P) {
    return this.jsonRpcClient.sendRequest<P, R>({
      method,
      params,
    });
  }

  // public getBestBlockHash() {
  //   return this.rpc<types.GetBestBlockHashResult>('getbestblockhash');
  // }

  // public getBlock<V extends 0 | 1 | 2>(params: types.GetBlockParams<V>) {
  //   return this.rpc<types.GetBlockResult<V>>('getblock', params);
  // }

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
