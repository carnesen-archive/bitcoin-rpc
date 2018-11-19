import * as http from 'http';

import * as types from 'bitcoin-rpc-types';

type BitcoinRpcRequest<P> = {
  method: string;
  params?: P;
  id?: null | number | string;
};

type BitcoinRpcResponse<R> = {
  result: R;
  error: null | {
    code: number;
    message: string;
    data?: unknown;
  };
  id?: null | number | string;
};

type ClientOptions = {
  username: string;
  password: string;
  hostname: string;
  port: number;
};

class BitcoinRpcError extends Error {
  public readonly code?: number | string;
  constructor(message?: string, code?: number | string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BitcoinRpcClient {
  private readonly options: ClientOptions;
  constructor(options: ClientOptions) {
    this.options = options;
  }
  public sendData(httpRequestData: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const httpRequestOptions: http.RequestOptions = {
        protocol: 'http:',
        hostname: this.options.hostname,
        port: this.options.port,
        method: 'POST',
        path: '/',
        auth: `${this.options.username}:${this.options.password}`,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': httpRequestData.length,
        },
      };
      const httpResponseHandler = (response: http.IncomingMessage) => {
        let httpResponseData = '';
        if (response.statusCode !== 200) {
          const err = new BitcoinRpcError(
            `http response code was ${response.statusCode}, "${response.statusMessage}"`,
            response.statusCode,
          );
          reject(err);
          return;
        }
        response.on('data', chunk => {
          httpResponseData += chunk;
        });

        response.on('end', () => {
          resolve(httpResponseData);
        });
      };
      const httpRequest = http.request(httpRequestOptions, httpResponseHandler);
      httpRequest.on('error', (err: NodeJS.ErrnoException) => {
        reject(new BitcoinRpcError(`http request failed "${err.message}"`, err.code));
      });

      httpRequest.end(httpRequestData);
    });
  }

  public async sendRequest<T>(method: string, params?: unknown) {
    const bitcoinRpcRequest = {
      method,
      params,
    };
    const httpRequestData = JSON.stringify(bitcoinRpcRequest);
    const httpResponseData = await this.sendData(httpRequestData);
    let bitcoinRpcResponse: BitcoinRpcResponse<T>;
    try {
      bitcoinRpcResponse = JSON.parse(httpResponseData);
    } catch (ex) {
      throw new BitcoinRpcError(`Failed to parse response data "${ex.message}"`);
    }
    if (bitcoinRpcResponse.error) {
      throw new BitcoinRpcError(
        bitcoinRpcResponse.error.message,
        bitcoinRpcResponse.error.code,
      );
    }
    return bitcoinRpcResponse.result as T;
  }

  public getBestBlockHash() {
    return this.sendRequest<types.GetBestBlockHashResult>('getbestblockhash');
  }

  public getBlock<V extends 0 | 1 | 2>(params: types.GetBlockParams<V>) {
    return this.sendRequest<types.GetBlockResult<V>>('getblock', params);
  }

  public getBlockHash(params: types.GetBlockHashParams) {
    return this.sendRequest<types.GetBlockHashResult>('getblockhash', params);
  }

  public getNetworkInfo() {
    return this.sendRequest<types.GetNetworkInfoResult>('getnetworkinfo');
  }

  public getWalletInfo() {
    return this.sendRequest<types.GetWalletInfoResult>('getwalletinfo');
  }
}
