import { Protocol } from '../constants';
import { ActionRoute, CurrencyAmount, Path } from '../interfaces';
import Decimal from 'decimal.js';

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

export const computePriceImpactPath = async (
  path: Path,
  poolDataProvider: (protocol: Protocol, poolKey: string) => Promise<any>,
) => {
  const { tokenInAmount, tokenOutAmount, actions } = path;
  const midPrice = await getMidPriceFromActions(actions);
  const inputAmount: CurrencyAmount = {
    currency: {
      chainId: '',
      address: '',
      decimals: 0,
      symbol: '',
    },
    amount: tokenInAmount,
  };

  const outputAmount: CurrencyAmount = {
    currency: {
      chainId: '',
      address: '',
      decimals: 0,
      symbol: '',
    },
    amount: tokenOutAmount,
  };

  return computePriceImpact(midPrice, inputAmount, outputAmount);
};

export const getMidPriceFromActions = async (actions: ActionRoute[]) => {
  // TODO: Implement mid price calculation from actions
  return new Decimal(0);
};
