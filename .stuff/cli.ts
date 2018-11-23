/* 
This command-line interface is not included in the published npm package.
It's used to generate type definitions programmatically using quicktype.
*/
import { join } from 'path';
import { ensureDirSync, writeFileSync, copyFileSync } from 'fs-extra';
import { execFileSync } from 'child_process';
import is from '@sindresorhus/is';
import axios from 'axios';
const i = is;

const usage = () => {
  console.log('Usage: ts-node cli.ts <method> [<arg0> ...]');
  process.exit(1);
};

const [, , pascalCasedMethodName, ...restArgs] = process.argv;

if (!pascalCasedMethodName) {
  usage();
}

const deriveTypeStringFromValueString = (value: any) => {
  if (!isNaN(Number(value))) {
    return 'number';
  } 
}

let paramsTypeString = 'never';
if (restArgs.length > 0) {
  const fieldStrings = restArgs.map(restArg => {
    const [paramName, paramValue] = restArg.split('=')  ;
    const paramTypeString;
  })
  paramsTypeString = `{
    ${}
  }`
} 
const paramsTypeDefinition = `export type ${pascalCasedMethodName}Params = `;

const lowerCasedMethodName = pascalCasedMethodName.toLowerCase();

const bitcoinCliExecutablePath = '/Users/chrisarnesen/bitcoin-0.17.0/bin/bitcoin-cli';
const bitcoinCliArgs = ['-testnet', '-named', lowerCasedMethodName, ...restArgs];
const bitcoinCliOutput = execFileSync(bitcoinCliExecutablePath, bitcoinCliArgs, {
  encoding: 'utf8',
});

const bitcoinCliOutputAsNumber = Number(bitcoinCliOutput);

if (!isNaN(bitcoinCliOutputAsNumber)) {
  
}

const srcDir = __dirname;
const methodDir = join(srcDir, pascalCasedMethodName);

ensureDirSync(methodDir);

const resultFilePath = join(methodDir, 'example.json');
writeFileSync(resultFilePath, bitcoinCliOutput);

const quicktypeCliPath = require.resolve('quicktype');
const quicktypeCliArgs = [
  '--src',
  resultFilePath,
  '--src-lang',
  'json',
  '--lang',
  'ts',
  '--just-types',
];
const quicktypeCliOutput = execFileSync(quicktypeCliPath, quicktypeCliArgs, {
  encoding: 'utf8',
});

const indexFilePath = join(methodDir, 'index.ts');
const indexFileContents = quicktypeCliOutput.replace(
  'interface Example',
  'type Result =',
);

writeFileSync(indexFilePath, indexFileContents);

copyFileSync(
  join(srcDir, 'getnetworkinfo', 'index.test.ts'),
  join(methodDir, 'index.test.ts'),
);
