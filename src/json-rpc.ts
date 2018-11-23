import * as http from 'http';
import { CodedError } from './error';

type JsonRpcId = null | number | string;

export type JsonRpcRequest<P> = {
  method: string;
  params?: P;
  id?: JsonRpcId;
};

export type JsonRpcResponse<R> = {
  result: R;
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
      const options: http.RequestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };
      const handler = (res: http.IncomingMessage) => {
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
      };
      const req = http.request(this.href, options, handler);
      req.on('error', (err: NodeJS.ErrnoException) => {
        reject(new CodedError(`http request failed "${err.message}"`, err.code));
      });

      req.end(data);
    });
  }

  public async sendRequest<P, R>(jsonRpcRequest: JsonRpcRequest<P>) {
    const data = JSON.stringify(jsonRpcRequest);
    const responseData = await this.sendData(data);
    let jsonRpcResponse: JsonRpcResponse<R>;
    try {
      jsonRpcResponse = JSON.parse(responseData);
    } catch (ex) {
      throw new CodedError(`Failed to parse response data "${ex.message}"`);
    }
    if (jsonRpcResponse.error) {
      throw new CodedError(jsonRpcResponse.error.message, jsonRpcResponse.error.code);
    }
    return jsonRpcResponse.result as R;
  }
}
