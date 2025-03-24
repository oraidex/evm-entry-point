import Decimal from 'decimal.js';
import {
  PoolData,
  PoolDataV2,
  PoolDataV3,
} from '../../interfaces/IPoolDataProvider';

export const formatPriceFromPoolData = (
  poolData: PoolData,
  tokenOut: string,
) => {
  switch (poolData.protocol) {
    case 'Oraidex':
      return formatPriceFromPoolDataV2(poolData, tokenOut);
    case 'OraidexV3':
      return formatPriceFromPoolDataV3(poolData, tokenOut);
    default:
      throw new Error('Invalid pool data');
  }
};

export const formatPriceFromPoolDataV3 = (
  poolData: PoolDataV3,
  tokenOut?: string,
) => {
  const isReverse = poolData.token0 !== tokenOut;
  const price = new Decimal(poolData.sqrtPrice)
    .div(new Decimal(10).pow(24))
    .sqrt();
  const sqrtPrice = isReverse ? price : new Decimal(1).div(price);
  return sqrtPrice;
};

export const formatPriceFromPoolDataV2 = (
  poolData: PoolDataV2,
  tokenOut?: string,
) => {
  const isReverse = poolData.token0 !== tokenOut;
  const price = new Decimal(poolData.reserve0).div(poolData.reserve1);
  return isReverse ? new Decimal(1).div(price) : price;
};
