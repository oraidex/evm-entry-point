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
):
  | {
      native_token: {
        denom: string;
      };
    }
  | {
      token: {
        contract_addr: string;
      };
    } => {
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

export const parsePoolKey = (poolKeyStr: string): any => {
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
