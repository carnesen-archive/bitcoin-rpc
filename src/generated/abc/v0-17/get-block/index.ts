import { GetBlock as GetBlock0 } from './0';
import { GetBlock as GetBlock1 } from './1';
import { GetBlock as GetBlock2 } from './2';

export type GetBlockParams =
  | GetBlock0['params']
  | GetBlock1['params']
  | GetBlock2['params'];

export type GetBlockResult<P extends GetBlockParams> = P extends GetBlock0['params']
  ? GetBlock0['result']
  : P extends GetBlock1['params']
    ? GetBlock1['result']
    : P extends GetBlock2['params'] ? GetBlock2['result'] : never;
