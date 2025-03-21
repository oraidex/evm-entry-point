import {
  ActionRoute,
  CurrencyAmount,
  OsorSmartRouteResponse,
  Path,
  Route,
} from '../interfaces';
import Decimal from 'decimal.js';
import { IPoolDataProvider } from '../interfaces/IPoolDataProvider';
import { formatPriceFromPoolData } from './price';

export const computePriceImpact = (
  midPrice: Decimal,
  inputAmount: CurrencyAmount,
  outputAmount: CurrencyAmount,
) => {
  const exactQuote = midPrice.mul(inputAmount.amount);
  // calculate slippage := (exactQuote - outputAmount) / exactQuote
  const slippage = exactQuote.sub(outputAmount.amount).div(exactQuote);
  return slippage;
};

export const getMidPriceFromPaths = async (
  paths: Path[],
  poolDataProvider: IPoolDataProvider,
) => {
  let midPrice = new Decimal(1);
  for (const path of paths) {
    const { actions } = path;
    for (const action of actions) {
      switch (action.type) {
        case 'Swap':
        case 'Convert': {
          // Both Swap and Convert use the same logic
          // Collect all pool requests to fetch them in parallel
          const poolRequests = action.swapInfo.map((path) => ({
            protocol: action.protocol,
            poolKey: path.poolId,
          }));

          // Fetch all pool data in parallel
          const poolDataResults =
            await poolDataProvider.getPoolData(poolRequests);

          // Calculate price impact for each path
          for (let i = 0; i < action.swapInfo.length; i++) {
            const path = action.swapInfo[i];
            const poolData = poolDataResults[i];

            if (!poolData) {
              throw new Error(
                `Pool data not found for path ${i}, poolId: ${path.poolId}`,
              );
            }

            const price = formatPriceFromPoolData(poolData, path.tokenOut);
            midPrice = midPrice.mul(price);
          }
          break;
        }
        case 'Bridge': {
          // Bridge is compare tokenAmountOut and tokenIn
          // For Bridge, we use the tokenOutAmount/tokenInAmount ratio
          midPrice = midPrice.mul(
            new Decimal(action.tokenOutAmount).div(action.tokenInAmount),
          );
          break;
        }
        default: {
          throw new Error(`Unsupported action type`);
        }
      }
    }
  }
  return midPrice;
};

export const computePriceImpactRoute = async (
  route: Route,
  poolDataProvider: IPoolDataProvider,
) => {
  const { swapAmount, returnAmount, paths } = route;
  const midPrice = await getMidPriceFromPaths(paths, poolDataProvider);

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
