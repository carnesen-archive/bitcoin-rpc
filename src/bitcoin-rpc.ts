// import * as http from 'http';
// import { CodedError } from './error';
// import { RpcRequest, RpcResponse } from './types';

// export type RpcOptions = {
//   rpcuser: string;
//   rpcpassword: string;
//   rpcport: string;
//   rpcconnect?: string;
// };

// export type BitcoinRpc = (method: string, params?: RpcParams) => Promise<any>;

// const sendData = (options: RpcOptions, data: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const { rpcuser, rpcpassword, rpcconnect = '127.0.0.1', rpcport } = options;

//     const req = http.request({
//       hostname: rpcconnect,
//       port: rpcport,
//       auth: `${rpcuser}:${rpcpassword}`,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': data.length,
//       },
//     });

//     req.once('response', (res: http.IncomingMessage) => {
//       let responseData = '';
//       if (res.statusCode !== 200) {
//         const err = new CodedError(
//           `http response code was ${res.statusCode}, "${res.statusMessage}"`,
//           res.statusCode,
//         );
//         reject(err);
//         return;
//       }
//       res.on('data', chunk => {
//         responseData += chunk;
//       });

//       res.on('end', () => {
//         resolve(responseData);
//       });
//     });

//     req.on('error', (err: NodeJS.ErrnoException) => {
//       reject(new CodedError(`http request failed "${err.message}"`, err.code));
//     });

//     req.end(data);
//   });
// };

// const sendRequest = async (options: RpcOptions, request: RpcRequest) => {
//   const data = JSON.stringify(request);
//   const responseData = await sendData(options, data);
//   let response: RpcResponse;
//   try {
//     response = JSON.parse(responseData);
//   } catch (ex) {
//     throw new Error(`Failed to parse response data "${ex.message}"`);
//   }
//   return response;
// };

// const getRandomId = () =>
//   Math.random()
//     .toString(36)
//     .slice(2);

// export const createBitcoinRpc = (options: RpcOptions) => {
//   const bitcoinRpc: BitcoinRpc = async (method, params) => {
//     const response = await sendRequest(options, {
//       method,
//       params,
//       id: getRandomId(),
//     });
//     const { error, result } = response;
//     if (error) {
//       throw new CodedError(error.message, error.code, error.data);
//     }
//     return result;
//   };
//   return bitcoinRpc;
// };
