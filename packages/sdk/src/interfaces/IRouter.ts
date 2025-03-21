import { Protocol } from '../constants/protocols';
import { OsorSmartRouteResponse } from './IOsor';

export type SwapOptions = {
  protocols: Protocol[];
  maxSplits?: number;
};

export type Currency = {
  chainId: string;
  address: string;
  decimals: number;
  symbol: string;
};

export type CurrencyAmount = {
  currency: Currency;
  amount: string;
};

export enum TradeType {
  EXACT_INPUT = 'EXACT_INPUT',
  EXACT_OUTPUT = 'EXACT_OUTPUT',
}

export enum ActionType {
  SWAP = 'Swap',
  BRIDGE = 'Bridge',
}

export type SwapPath = {
  poolId: string;
  tokenOut: string;
};

export type BasicInfo = {
  protocol: Protocol;
  tokenIn: string;
  tokenInAmount: string;
  tokenOut: string;
  tokenOutAmount: string;
};

export type SwapActionRoute = {
  type: 'Swap';
  swapInfo: SwapPath[];
} & BasicInfo;

export type BridgeActionRoute = {
  type: 'Bridge';
} & BasicInfo;

export type ConvertActionRoute = {
  type: 'Convert';
  swapInfo: SwapPath[];
} & BasicInfo;

export type ActionRoute =
  | SwapActionRoute
  | BridgeActionRoute
  | ConvertActionRoute;

export type Path = {
  chainId: string;
  tokenIn: string;
  tokenInAmount: string;
  tokenOut: string;
  tokenOutAmount: string;
  tokenOutChainId: string;
  actions: ActionRoute[];
};

export type Route = {
  swapAmount: string;
  returnAmount: string;
  paths: Path[];
};

/**
 * Provides functionality for finding optimal swap routes on Multiple protocol.
 *
 * @export
 * @abstract
 * @class IRouter
 */
export abstract class IRouter<T> {
  /**
   * Finds the optimal way to swap tokens, and returns the route as well as a quote for the swap.
   * Considers split routes, multi-hop swaps, and gas costs.
   *
   * @abstract
   * @param amount The amount specified by the user. For EXACT_IN swaps, this is the input token amount. For EXACT_OUT swaps, this is the output token.
   * @param quoteCurrency The currency of the token we are returning a quote for. For EXACT_IN swaps, this is the output token. For EXACT_OUT, this is the input token.
   * @param tradeType The type of the trade, either exact in or exact out.
   * @param [swapOptions] Optional config for executing the swap. If provided, calldata for executing the swap will also be returned.
   * @param [partialRoutingConfig] Optional config for finding the optimal route.
   * @returns The swap route.
   */
  abstract route<T>(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    swapType: TradeType,
    swapOptions?: SwapOptions,
  ): Promise<T | null>;
}
