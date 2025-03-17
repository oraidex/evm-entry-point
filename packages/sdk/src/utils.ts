import { AssetInfo } from "@oraichain/oraidex-contracts-sdk";
import { PoolKey } from "@oraichain/oraidex-contracts-sdk/build/OraiswapV3.types";
import Long from "long";

export const isCw20Token = (token: string) => {
    return token.startsWith('orai1');
}

export const toBinary = (obj: any) => {
  const encoder = new TextEncoder();
  return Buffer.from(encoder.encode(JSON.stringify(obj))).toString('base64');
}


export const calculateTimeoutTimestamp = (timeout: number, dateNow?: number): string => {
  return Long.fromNumber(Math.floor((dateNow ?? Date.now()) / 1000) + timeout)
    .multiply(1000000000)
    .toString();
};


export const assetInfoToDenom = (
    value:
      | {
          native_token: {
            denom: string;
          };
        }
      | {
          token: {
            contract_addr: string;
          };
        },
  ) => {
    if ('native_token' in value) {
      return value.native_token.denom;
    }
  
    return value.token.contract_addr;
  };
  
export const denomToAssetInfo = (
value: string,
): AssetInfo => {
if (value.startsWith('orai1')) {
    return {
    token: {
        contract_addr: value,
    },
    };
}

return {
    native_token: {
    denom: value,
    },
};
};

export const parsePoolKey = (poolKeyStr: string): PoolKey => {
const [tokenX, tokenY, fee, tickSpacing] = poolKeyStr.split('-');
return {
    token_x: tokenX!,
    token_y: tokenY!,
    fee_tier: {
    fee: Number(fee),
    tick_spacing: Number(tickSpacing),
    },
};
};

