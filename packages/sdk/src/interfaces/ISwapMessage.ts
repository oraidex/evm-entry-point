import { AssetInfo } from "@oraichain/oraidex-contracts-sdk";
import { PoolKey } from "@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types";

 export interface SwapV2 {
    offer_asset_info: AssetInfo;
    ask_asset_info: AssetInfo;
  }

  export interface SwapV3 {
    pool_key: PoolKey;
    x_to_y: boolean;
  }