import * as example from './example.json';
import * as examples from './examples.json';

export type foo = typeof examples;
export type GetWalletInfoParams = never;
export type GetWalletInfoResult = {
  walletname: string;
  walletversion: number;
  balance: number;
  unconfirmed_balance: number;
  immature_balance: number;
  txcount: number;
  keypoololdest: number;
  keypoolsize: number;
  paytxfee: number;
  hdseedid: string;
  hdmasterkeyid: string;
  private_keys_enabled: boolean;
};
