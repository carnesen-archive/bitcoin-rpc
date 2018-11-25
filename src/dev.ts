import { ensureDir, readFile } from 'fs-extra';
import { join } from 'path';
import {
  readBitcoinConfSync,
  readBitcoinRpcHrefSync,
  BitcoinConf,
} from './configuration';
import { JsonRpcClient, JsonRpcParams } from './json-rpc';
const pkg = require('../package.json');

const methodsDir = join(__dirname, 'methods');

type Example = {
  meta: any;
  params?: JsonRpcParams;
  result: any;
};

class DevClient {
  private readonly jsonRpcClient: JsonRpcClient;
  private readonly bitcoinConf: BitcoinConf;
  constructor() {
    const href = readBitcoinRpcHrefSync();
    this.jsonRpcClient = new JsonRpcClient(href);
    this.bitcoinConf = readBitcoinConfSync();
    if (this.bitcoinConf.rpcpassword) {
      this.bitcoinConf.rpcpassword = 'xxxxxxx';
    }
  }

  async getMeta() {
    const result = await this.jsonRpcClient.rpc('getnetworkinfo');
    const { version, subversion, protocolversion } = result;
    return {
      timestamp: Date.now(),
      clientVersion: pkg.version,
      serverVersion: result.subversion,
    };
  }

  public async upsertMethod(method: string, params?: JsonRpcParams) {
    const methodDir = join(methodsDir, method.toLowerCase());
    const examplesFilePath = join(methodDir, 'examples.json');
    await ensureDir(methodDir);
    let examplesFileContents: string = '[]';
    try {
      examplesFileContents = await readFile(examplesFilePath, 'utf8');
    } catch (ex) {
      if (ex.code !== 'ENOENT') {
        throw ex;
      }
    }
    const examples: Example[] = JSON.parse(examplesFileContents);

    const indexFilePath = join(methodDir, 'index.ts');
  }
}

// const examplesDir = join(__dirname, 'examples');

// const getExample = async (method: string, params?: unknown) => {
//   const meta = await getMeta();
//   const { request, response } = await sendRequest(method, params);
//   const methodDir = join(examplesDir, method);
//   await ensureDir(methodDir);
//   const exampleName = `example_${meta.timestamp}`;
//   const fileName = `${exampleName}.json`;
//   const fileContents = JSON.stringify({ meta, request, response }, null, 2);
//   await writeFile(join(methodDir, fileName), fileContents);
//   const indexFilePath = join(__dirname, 'index.ts');
//   const indexFileCode = `
// import * as ${exampleName} from './examples/${method}/${fileName}';
// export { ${exampleName} };
// `;
//   await appendFile(indexFilePath, indexFileCode);
// };

(async () => {
  try {
    const client = new DevClient();
    // const foo = await client.getMeta();
    await client.upsertMethod('getwalletinfo');
    debugger;
    process.exit(0);
  } catch (ex) {
    setTimeout(() => {
      throw ex;
    }, 0);
  }
})();
