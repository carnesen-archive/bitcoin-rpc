import * as http from 'http';
import { URL } from 'url';

import { CodedError } from '@carnesen/coded-error';

export const sendData = (href: string, data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = new URL(href);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      auth: `${url.username}:${url.password}`,
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
};
