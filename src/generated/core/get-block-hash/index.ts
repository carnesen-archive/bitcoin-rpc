// This file is generated programmatically. Do not edit.

import * as examplesJson from './examples.json';
export const examples: Example[] = examplesJson;

export type Example = {
  server: Server;
  request: Request;
  result: string;
};

export type Request = {
  method: string;
  params: Params;
};

export type Params = {
  height: number;
};

export type Server = {
  subversion: string;
};
