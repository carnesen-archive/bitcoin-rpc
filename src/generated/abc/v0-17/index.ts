// This file is generated programmatically. Do not edit.

import { JsonRpcClient, JsonRpcParams } from '../../../json-rpc';
import { CodedError } from '../../../error';

import { GetBlockParams, GetBlockResult } from './get-block';
import { GetBestBlockHashResult } from './get-best-block-hash';
import { GetBlockHashParams, GetBlockHashResult } from './get-block-hash';

export class Client {
  private readonly jsonRpcClient: JsonRpcClient;

  constructor(href: string) {
    this.jsonRpcClient = new JsonRpcClient(href);
  }

  public async rpc<R>(method: string, params?: JsonRpcParams) {
    const response = await this.jsonRpcClient.sendRequest({
      method,
      params,
    });
    if (response.error) {
      throw new CodedError(response.error.message, response.error.code);
    }
    return response.result as R;
  }

  public getBestBlockHash() {
    return this.rpc<GetBestBlockHashResult>('getbestblockhash');
  }

  public getBlock<P extends GetBlockParams>(params: P) {
    return this.rpc<GetBlockResult<P>>('getblock', params);
  }

  public getBlockHash(params: GetBlockHashParams) {
    return this.rpc<GetBlockHashResult>('getblockhash', params);
  }
}

const c = new Client('foo');
const a = c.getBlock({ blockhash: '1', verbosity: 2 });

a.then(result => {
  result.tx;
});
