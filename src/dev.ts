import { ensureDir, readFile, stat, writeFile, readdir } from 'fs-extra';
import { join, dirname } from 'path';
import isEqual = require('lodash.isequal');
import camelCase = require('lodash.camelcase');
import upperFirst = require('lodash.upperfirst');
import uniqWith = require('lodash.uniqwith');
import { readBitcoinConfSync, readBitcoinRpcHrefSync, isEnabled } from './configuration';
import { JsonRpcClient, JsonRpcParams, JsonRpcRequest, JsonRpcResult } from './json-rpc';
import { promisify } from 'util';
import { execFile } from 'child_process';

const methodsDir = join(__dirname, 'methods');

type Server = {
  subversion: string;
};

type Example = {
  server: Server;
  request: JsonRpcRequest;
  result: JsonRpcResult;
};

const isEqualRequest = (r1: JsonRpcRequest, r2: JsonRpcRequest) => {
  return isEqual(r1.params, r2.params) && r1.method === r2.method;
};

const isEqualServer = (s1: Server, s2: Server) => isEqual(s1, s2);

const pascalCase = (str: string) => upperFirst(camelCase(str));

const doNotEditWarning = '// This file is generated programmatically. Do not edit.';

const readExamples = async (dirName: string) => {
  const dir = join(methodsDir, dirName);
  const examplesFilePath = join(dir, 'examples.json');
  let examples: Example[] = [];
  try {
    const examplesFileContents = await readFile(examplesFilePath, 'utf8');
    examples = JSON.parse(examplesFileContents);
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex;
    }
  }
  return examples;
};

const fix = async (filePath: string) => {
  await promisify(execFile)('tslint', ['--fix', filePath]);
};

const writeExamples = async (dirName: string, examples: Example[]) => {
  const methodDir = join(methodsDir, dirName);
  const examplesFilePath = join(methodDir, 'examples.json');
  await ensureDir(methodDir);
  await writeFile(examplesFilePath, JSON.stringify(examples, null, 2));
  const { stdout: quicktypeOutput } = await promisify(execFile)('quicktype', [
    '--src',
    examplesFilePath,
    '--src-lang',
    'json',
    '--lang',
    'ts',
    '--just-types',
  ]);
  const indexFileContents = [
    doNotEditWarning,
    '',
    'import * as examples from "./examples.json";',
    'export { examples };',
    '',
    quicktypeOutput,
  ].join('\n');
  const indexFilePath = join(methodDir, 'index.ts');
  await writeFile(indexFilePath, indexFileContents);
  await fix(indexFilePath);
};

class DevClient {
  private readonly jsonRpcClient: JsonRpcClient;
  constructor() {
    const { regtest } = readBitcoinConfSync();
    if (!isEnabled(regtest)) {
      throw new Error('Bitcoin server must be running in "regtest" mode');
    }
    const href = readBitcoinRpcHrefSync();
    this.jsonRpcClient = new JsonRpcClient(href);
  }

  public async upsertExample(dirName: string, request: JsonRpcRequest) {
    const { subversion } = await this.jsonRpcClient.rpc('getnetworkinfo');
    const server: Server = {
      subversion,
    };
    const examples = await readExamples(dirName);
    const existingExample = examples.find(
      example =>
        isEqualServer(server, example.server) && isEqualRequest(request, example.request),
    );
    if (!existingExample) {
      const result = await this.jsonRpcClient.sendRequest(request);
      examples.push({
        server,
        request,
        result,
      });
      await writeExamples(dirName, examples);
    }
  }

  // public async upsertOne(kebabCasedMethod: string, params?: JsonRpcParams) {
  //   const pascalCasedMethod = pascalCase(kebabCasedMethod);
  //   const method = pascalCasedMethod.toLowerCase();
  //   let v: string;
  //   if (params) {
  //     const { verbose, verbosity } = params;
  //     if (typeof verbose === 'number') {
  //       v = verbose.toString();
  //     } else if (typeof verbosity === 'number') {
  //       v = verbosity.toString();
  //     }
  //   }
  // }

  public async updateAll() {
    const fileNames = await readdir(methodsDir);
    const dirNames = fileNames.filter(fileName => fileName !== 'index.ts');
    for (const dirName of dirNames) {
      const examples = await readExamples(dirName);
      for (const example of examples) {
        await this.upsertExample(dirName, example.request);
      }
    }
    const indexFileItems = dirNames.map(dirName => {
      const pascalCasedDirName = pascalCase(dirName);
      const importString = `import * as ${pascalCasedDirName} from "./${dirName}";`;
      const exportString = `export { ${pascalCasedDirName} };`;
      return `${importString}\n${exportString}`;
    });
    const indexFileContents = `${doNotEditWarning}\n\n${indexFileItems.join('\n')}\n`;
    const indexFilePath = join(methodsDir, 'index.ts');
    await writeFile(indexFilePath, indexFileContents);
    await fix(indexFilePath);
  }
}

(async () => {
  try {
    const client = new DevClient();
    await client.upsertExample('get-block-hash', {
      method: 'getblockhash',
      params: { height: 0 },
    });
    // await client.upsertOne('get-wallet-info', {
    //   blockhash: '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206',
    //   verbosity: 0,
    // });
    await client.updateAll();
    process.exit(0);
  } catch (ex) {
    setTimeout(() => {
      throw ex;
    }, 0);
  }
})();
