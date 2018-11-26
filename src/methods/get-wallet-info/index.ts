// This file is generated programmatically. Do not edit.

import * as examples from './examples.json';
export { examples };

export interface Examples {
  meta: Meta;
  result: Result;
}

export interface Meta {
  method: string;
  version: string;
}

export interface Result {
  walletname: string;
  walletversion: number;
  balance: number;
  unconfirmed_balance: number;
  immature_balance: number;
  txcount: number;
  keypoololdest: number;
  keypoolsize: number;
  keypoolsize_hd_internal: number;
  paytxfee: number;
  hdseedid: string;
  hdmasterkeyid: string;
  private_keys_enabled: boolean;
}
