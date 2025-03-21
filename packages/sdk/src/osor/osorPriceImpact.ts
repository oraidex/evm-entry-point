import Decimal from 'decimal.js';
import { CurrencyAmount, OsorSmartRouteResponse } from '../interfaces';
import { IPoolDataProvider } from '../interfaces/IPoolDataProvider';
import { getMidPriceFromPaths, computePriceImpact } from '../libs';

export const computePriceImpactFromOsorResponse = async (
  osorResponse: OsorSmartRouteResponse,
  poolDataProvider: IPoolDataProvider,
) => {
  const { swapAmount, returnAmount, routes } = osorResponse;
  const midPriceRoutes = await Promise.all(
    routes.map((route) => getMidPriceFromPaths(route.paths, poolDataProvider)),
  );

  const swapAmounts = routes.map((route) => route.swapAmount);
  const midPrice = midPriceRoutes
    .reduce((acc, curr, index) => {
      return acc.add(curr.mul(swapAmounts[index]));
    }, new Decimal(0))
    .div(swapAmount);

  const inputAmount: CurrencyAmount = {
    currency: {
      chainId: '',
      address: '',
      decimals: 0,
      symbol: '',
    },
    amount: swapAmount,
  };

  const outputAmount: CurrencyAmount = {
    currency: {
      chainId: '',
      address: '',
      decimals: 0,
      symbol: '',
    },
    amount: returnAmount,
  };
  return computePriceImpact(midPrice, inputAmount, outputAmount);
};
