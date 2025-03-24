import { Protocol } from '../constants';

export type PoolDataV2 = {
  protocol: 'Oraidex';
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  liquidity: string;
};

export type PoolDataV3 = {
  protocol: 'OraidexV3';
  token0: string;
  token1: string;
  sqrtPrice: string;
  liquidity: string;
  tick: string;
};

export type PoolData = PoolDataV2 | PoolDataV3;

export type GetPoolDataArg = {
  protocol: Protocol;
  poolKey: string;
};

export interface IPoolDataProvider {
  getPoolData(arg: GetPoolDataArg[]): Promise<PoolData[]>;
}
