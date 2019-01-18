import { dirname, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { URL } from 'url';

import { BITCOIN_CONFIG_OPTIONS } from '@carnesen/bitcoin-config';
import tempWrite = require('temp-write');
import * as tempy from 'tempy';

import { inferRpcHrefFromConfig } from '../infer-rpc-href-from-config';

describe(inferRpcHrefFromConfig.name, () => {
  it('by default reads cookie file and returns an "href" connection string', () => {
    // Unless bitcoin is running in main mode with the default datadir
    // this is expected to throw "ENOENT" a.k.a file not found.
    try {
      inferRpcHrefFromConfig();
    } catch (ex) {
      if (ex.code !== 'ENOENT') {
        throw ex;
      }
    }
  });

  it('returns href with passed username and password', () => {
    const url = new URL(
      inferRpcHrefFromConfig({ rpcuser: 'carnesen', rpcpassword: '12345678' }),
    );
    expect(url.username).toBe('carnesen');
    expect(url.password).toBe('12345678');
  });

  it('returns href with passed password and default rpcuser', () => {
    const url = new URL(inferRpcHrefFromConfig({ rpcpassword: '12345678' }));
    expect(url.password).toBe('12345678');
    expect(url.username).toBe(BITCOIN_CONFIG_OPTIONS.rpcuser.defaultValue);
  });

  it('takes port from (in order) config.rpcport || config.rpcconnect || defaultConfig.rpcport', () => {
    const config = { rpcpassword: 'x', rpcport: 1111, rpcconnect: ':2222' };
    expect(new URL(inferRpcHrefFromConfig(config)).port).toBe('1111');
    delete config.rpcport;
    expect(new URL(inferRpcHrefFromConfig(config)).port).toBe('2222');
    delete config.rpcconnect;
    expect(new URL(inferRpcHrefFromConfig(config)).port).toBe('8332');
  });

  it('takes hostname from (in order) config.rpcconnect || defaultConfig.rpcport', () => {
    const config = { rpcpassword: 'x', rpcconnect: '1.2.3.4:2222' };
    expect(new URL(inferRpcHrefFromConfig(config)).hostname).toBe('1.2.3.4');
    delete config.rpcconnect;
    expect(new URL(inferRpcHrefFromConfig(config)).hostname).toBe('127.0.0.1');
  });

  it('properly constructs an []-wrapped hostname href from an ipv6 address', () => {
    const config = { rpcpassword: 'x', rpcconnect: '[::1]:2222' };
    expect(new URL(inferRpcHrefFromConfig(config)).hostname).toBe('[::1]');
  });

  it('properly constructs an un-[]-wrapped hostname from a wrapped hostname', () => {
    const config = { rpcpassword: 'x', rpcconnect: '[www.carnesen.com]' };
    expect(new URL(inferRpcHrefFromConfig(config)).hostname).toBe('www.carnesen.com');
  });

  it('reads cookie file from top datadir when chainName is "main"', () => {
    const cookieFilePath = tempWrite.sync('foo:bar', '.cookie');
    const config = { datadir: dirname(cookieFilePath) };
    const url = new URL(inferRpcHrefFromConfig(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie from datadir-relative rpccookiefile', () => {
    const cookieFilePath = tempWrite.sync('foo:bar', 'not.cookie');
    const config = { datadir: dirname(cookieFilePath), rpccookiefile: 'not.cookie' };
    const url = new URL(inferRpcHrefFromConfig(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie from absolute rpccookiefile', () => {
    const cookieFilePath = tempWrite.sync('foo:bar');
    const config = { rpccookiefile: cookieFilePath };
    const url = new URL(inferRpcHrefFromConfig(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie file from testnet3 datasubdir when testnet is true', () => {
    const datadir = tempy.directory();
    const subDatadir = join(datadir, 'testnet3');
    mkdirSync(subDatadir);
    writeFileSync(join(subDatadir, '.cookie'), 'foo:bar');
    const config = { datadir, testnet: true };
    const url = new URL(inferRpcHrefFromConfig(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('reads cookie file from regtest datasubdir when regtest is true', () => {
    const datadir = tempy.directory();
    const subDatadir = join(datadir, 'regtest');
    mkdirSync(subDatadir);
    writeFileSync(join(subDatadir, '.cookie'), 'foo:bar');
    const config = { datadir, regtest: true };
    const url = new URL(inferRpcHrefFromConfig(config));
    expect(url.username).toBe('foo');
    expect(url.password).toBe('bar');
  });

  it('throws "invalid port" if port in rpcconnect is not a number', () => {
    expect(() => {
      inferRpcHrefFromConfig({ rpcconnect: '1.2.3.4:foo' });
    }).toThrow('Invalid port');
  });

  it('throws "username:password" if cookie file does not have expected format', () => {
    const rpccookiefile = tempWrite.sync('foo bar baz');
    expect(() => {
      inferRpcHrefFromConfig({ rpccookiefile });
    }).toThrow('username:password');
  });
});
