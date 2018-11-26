// This file is generated programmatically. Do not edit.

import * as examples from './examples.json';
export { examples };

export interface Examples {
  server: Server;
  request: Request;
  result: string;
}

export interface Request {
  method: string;
  params: Params;
}

export interface Params {
  height: number;
}

export interface Server {
  subversion: string;
}
