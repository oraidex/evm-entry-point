import {
    AssetInfo,
    PoolKey,
  } from "@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types";
  
  export type Protocols = "Oraidex" | "OraidexV3" | "Osmosis";
  
  export type TokenNode = {
    address: string;
    chainId: string;
  };
  
  export type RouteParams = {
    sourceAsset: TokenNode;
    destAsset: TokenNode;
    amount: bigint;
  };
  
  export type Path = {
    poolId: string;
    tokenOut: string;
  };
  
  export type ActionRoute = {
    type: string;
    protocol: Protocols;
    tokenIn: string;
    tokenInAmount: string;
    tokenOut: string;
    tokenOutAmount: string;
    swapInfo: Path[];
  };
  
  export type RouteResponse = {
    swapAmount: string;
    returnAmount: string;
    paths: {
      chainId: string;
      tokenIn: string;
      tokenInAmount: string;
      tokenOut: string;
      tokenOutAmount: string;
      tokenOutChainId: string;
      actions: ActionRoute[];
    }[];
  };
  
  export type SmartRouteResponse = {
    swapAmount: string;
    returnAmount: string;
    routes: RouteResponse[];
  };
  
  export type SmartRouteConfig = {
    swapOptions: {
      protocols: Protocols[];
      maxSplits?: number;
    };
  };
  
  // swap cw20 token
  export interface OraiSwap {
    offer_asset_info: AssetInfo;
    ask_asset_info: AssetInfo;
  }
  export interface SwapV3 {
    pool_key: PoolKey;
    x_to_y: boolean;
  }
  