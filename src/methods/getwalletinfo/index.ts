import * as examples from './examples.json';

export type Params = never;
export type Result = (typeof examples[0])['result'];
export { examples };
