#!/usr/bin/env node
import { BitcoinDevService } from '@carnesen/bitcoin-dev-service';
import { resolve } from 'path';

export const datadir = resolve(__dirname, '..', 'tmp');

export const devService = new BitcoinDevService({ datadir });

if (module === require.main) {
  devService.install();
}
