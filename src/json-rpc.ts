import * as http from 'http';
import { CodedError } from './error';
import { URL } from 'url';

type JsonRpcId = null | number | string;

type JsonRpcNamedParams = {
  [name: string]: any;
};

export type JsonRpcParams = JsonRpcNamedParams;

export type JsonRpcResult = any;

export type JsonRpcRequest = {
  method: string;
  params?: JsonRpcParams;
  id?: JsonRpcId;
  jsonrpc?: '2.0';
};

export type JsonRpcResponse = {
  result: JsonRpcResult;
  error: null | {
    code: number;
    message: string;
    data?: unknown;
  };
  id?: JsonRpcId;
};

export class JsonRpcClient {
  private readonly href: string;
  constructor(href: string) {
    this.href = href;
  }
  public sendData(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const { protocol, username, password, hostname, port } = new URL(this.href);

      const req = http.request({
        protocol,
        hostname,
        port,
        auth: `${username}:${password}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      });

      req.once('response', (res: http.IncomingMessage) => {
        let responseData = '';
        if (res.statusCode !== 200) {
          const err = new CodedError(
            `http response code was ${res.statusCode}, "${res.statusMessage}"`,
            res.statusCode,
          );
          reject(err);
          return;
        }
        res.on('data', chunk => {
          responseData += chunk;
        });

        res.on('end', () => {
          resolve(responseData);
        });
      });

      req.on('error', (err: NodeJS.ErrnoException) => {
        reject(new CodedError(`http request failed "${err.message}"`, err.code));
      });

      req.end(data);
    });
  }

  public async sendRequest(jsonRpcRequest: JsonRpcRequest) {
    const data = JSON.stringify(jsonRpcRequest);
    const responseData = await this.sendData(data);
    let jsonRpcResponse: JsonRpcResponse;
    try {
      jsonRpcResponse = JSON.parse(responseData);
    } catch (ex) {
      throw new Error(`Failed to parse response data "${ex.message}"`);
    }
    return jsonRpcResponse;
  }
}
