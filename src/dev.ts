import { ensureDir, readFile, stat, writeFile, readdir } from 'fs-extra';
import { join, dirname } from 'path';
import isEqual = require('lodash.isequal');
import camelCase = require('lodash.camelcase');
import upperFirst = require('lodash.upperfirst');
import uniqWith = require('lodash.uniqwith');
import { readBitcoinConfSync, readBitcoinRpcHrefSync, isEnabled } from './configuration';
import { JsonRpcClient, JsonRpcParams } from './json-rpc';
import { promisify } from 'util';
import { execFile } from 'child_process';

const methodsDir = join(__dirname, 'methods');

type Example = {
  meta: {
    method: string;
    params?: JsonRpcParams;
    version: string;
  };
  result: any;
};

const pascalCase = (str: string) => upperFirst(camelCase(str));

const doNotEditWarning = '// This file is generated programmatically. Do not edit.';

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

  private async quicktype(jsonFilePath: string) {
    const { stdout } = await promisify(execFile)('quicktype', [
      '--src',
      jsonFilePath,
      '--src-lang',
      'json',
      '--lang',
      'ts',
      '--just-types',
    ]);
    return stdout;
  }

  private async fix(tsFilePath: string) {
    await promisify(execFile)('tslint', ['--fix', tsFilePath]);
  }

  private getExamplesFilePath(kebabCasedMethod: string) {
    const methodDir = join(methodsDir, kebabCasedMethod);
    const examplesFilePath = join(methodDir, 'examples.json');
    return examplesFilePath;
  }

  private async readExamples(kebabCasedMethod: string) {
    const examplesFilePath = this.getExamplesFilePath(kebabCasedMethod);
    let examples: Example[] = [];
    try {
      const examplesFileContents = await readFile(examplesFilePath, 'utf8');
      examples = JSON.parse(examplesFileContents);
    } catch (ex) {
      if (ex.code !== 'ENOENT') {
        throw ex;
      }
      await ensureDir(dirname(examplesFilePath));
      await writeFile(examplesFilePath, JSON.stringify(examples));
    }
    return examples;
  }

  public async upsertOne(kebabCasedMethod: string, params?: JsonRpcParams) {
    const pascalCasedMethod = pascalCase(kebabCasedMethod);
    const method = pascalCasedMethod.toLowerCase();
    const { subversion: version } = await this.jsonRpcClient.rpc('getnetworkinfo');
    const meta: Example['meta'] = {
      method,
      version,
    };
    if (params) {
      meta.params = params;
    }
    const methodDir = join(methodsDir, kebabCasedMethod);
    const examples = await this.readExamples(kebabCasedMethod);
    const existingExample = examples.find(example => isEqual(meta, example.meta));
    const examplesFilePath = this.getExamplesFilePath(kebabCasedMethod);
    if (!existingExample) {
      const result = await this.jsonRpcClient.rpc(method, params);
      examples.push({
        meta,
        result,
      });
      const examplesFileContents = JSON.stringify(examples, null, 2);
      await ensureDir(methodDir);
      await writeFile(examplesFilePath, examplesFileContents);
    }
    const indexFilePath = join(methodDir, 'index.ts');
    const quicktypeOutput = await this.quicktype(examplesFilePath);
    const indexFileContents = [
      doNotEditWarning,
      '',
      'import * as examples from "./examples.json";',
      'export { examples };',
      '',
      quicktypeOutput,
    ].join('\n');

    await writeFile(indexFilePath, indexFileContents);
    await this.fix(indexFilePath);
  }

  public async updateAll() {
    const fileNames = await readdir(methodsDir);
    const kebabCasedMethods = fileNames.filter(fileName => fileName !== 'index.ts');
    for (const kebabCasedMethod of kebabCasedMethods) {
      const examples: Example[] = await this.readExamples(kebabCasedMethod);
      const paramsArray = uniqWith(examples.map(example => example.meta.params), isEqual);
      for (const params of paramsArray) {
        await this.upsertOne(kebabCasedMethod, params);
      }
    }
    const indexFileItems = kebabCasedMethods.map(kebabCasedMethod => {
      const pascalCasedMethod = pascalCase(kebabCasedMethod);
      const importString = `import * as ${pascalCasedMethod} from "./${kebabCasedMethod}";`;
      const exportString = `export { ${pascalCasedMethod} };`;
      return `${importString}\n${exportString}`;
    });
    const indexFileContents = `${doNotEditWarning}\n\n${indexFileItems.join('\n')}\n`;
    const indexFilePath = join(methodsDir, 'index.ts');
    await writeFile(indexFilePath, indexFileContents);
    await this.fix(indexFilePath);
  }
}

(async () => {
  try {
    const client = new DevClient();
    // const foo = await client.getMeta();
    // await client.upsertOne('get-wallet-info');
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
