import {
  OraiswapPairTypes,
  OraiswapV3Types,
} from '@oraichain/oraidex-contracts-sdk';
import { PoolResponse } from '@oraichain/oraidex-contracts-sdk/build/OraiswapPair.types';
import { JsonRpcProvider } from 'ethers';
import {
  MULTICALL_ADDRESS,
  WASMD_PRECOMPILE_ENTRY,
} from '../constants/addresses';
import {
  GetPoolDataArg,
  IPoolDataProvider,
  PoolData,
  PoolDataV2,
  PoolDataV3,
} from '../interfaces/IPoolDataProvider';
import {
  assetInfoToDenom,
  extractJsonFromHexString,
  parsePoolKey,
} from '../utils';
import {
  IWasmd__factory,
  Multicall,
  Multicall__factory,
} from './typechain-types';

export interface OraidexPoolDataProviderConfig {
  multicallAddress?: string;
  chunkSize?: number;
}

export const defaultOraidexPoolDataProviderConfig: OraidexPoolDataProviderConfig =
{
  multicallAddress: MULTICALL_ADDRESS,
  chunkSize: 15,
};

export class OraidexPoolDataProvider implements IPoolDataProvider {
  static readonly ORAIDEX_V3_ADDRESS =
    'orai10s0c75gw5y5eftms5ncfknw6lzmx0dyhedn75uz793m8zwz4g8zq4d9x9a';
  config: Required<OraidexPoolDataProviderConfig>;
  multicall: Multicall;

  constructor(
    public jsonRpcProvider: JsonRpcProvider,
    config: OraidexPoolDataProviderConfig,
  ) {
    const finalConfig: Required<OraidexPoolDataProviderConfig> = {
      multicallAddress:
        config.multicallAddress ??
        defaultOraidexPoolDataProviderConfig.multicallAddress ??
        MULTICALL_ADDRESS,
      chunkSize:
        config.chunkSize ??
        defaultOraidexPoolDataProviderConfig.chunkSize ??
        15,
    };

    this.config = finalConfig;

    this.multicall = Multicall__factory.connect(
      this.config.multicallAddress,
      this.jsonRpcProvider,
    );
  }

  async getPoolData(args: GetPoolDataArg[]): Promise<PoolData[]> {
    const calls = args.map((arg) => {
      if (arg.protocol === 'Oraidex') {
        return this.getPoolDataV2Call(arg.poolKey);
      } else {
        return this.getPoolDataV3Call(arg.poolKey);
      }
    });

    const chunks = Array.from(
      { length: Math.ceil(calls.length / this.config.chunkSize) },
      (_, i) =>
        calls.slice(i * this.config.chunkSize, (i + 1) * this.config.chunkSize),
    );
    const chunksResult = await Promise.all(
      chunks.map(async (chunk) => {
        const result = Array.from(
          await this.multicall.aggregate.staticCallResult(chunk),
        );
        return result[1] as unknown as string[];
      }),
    );

    const callResult = chunksResult.flat();
    if (callResult.length !== args.length) {
      throw new Error('Call result length does not match arg length');
    }
    const poolData = callResult.map((result, index) => {
      const poolData = Buffer.from(result.slice(2), 'hex').toString();
      const jsonData = extractJsonFromHexString(poolData);
      if (args[index].protocol === 'Oraidex') {
        const jsonDataPoolV2Data: PoolResponse = jsonData;
        return {
          protocol: 'Oraidex',
          token0: assetInfoToDenom(jsonDataPoolV2Data.assets[0].info),
          token1: assetInfoToDenom(jsonDataPoolV2Data.assets[1].info),
          reserve0: jsonDataPoolV2Data.assets[0].amount,
          reserve1: jsonDataPoolV2Data.assets[1].amount,
          liquidity: jsonDataPoolV2Data.total_share,
        } as PoolDataV2;
      } else {
        const jsonDataPoolV3Data: OraiswapV3Types.Pool = jsonData;
        const poolKeyObj = parsePoolKey(args[index].poolKey);
        return {
          protocol: 'OraidexV3',
          token0: poolKeyObj.token_x,
          token1: poolKeyObj.token_y,
          sqrtPrice: jsonDataPoolV3Data.sqrt_price,
          liquidity: jsonDataPoolV3Data.liquidity,
          tick: jsonDataPoolV3Data.current_tick_index.toString(),
        } as PoolDataV3;
      }
    });
    return poolData;
  }

  getPoolDataV2Call(poolKey: string): Multicall.CallStruct {
    const queryInfo = {
      pool: {},
    } as OraiswapPairTypes.QueryMsg;

    const encodedMsg = IWasmd__factory.createInterface().encodeFunctionData(
      'query',
      [poolKey, Buffer.from(JSON.stringify(queryInfo))],
    );

    return {
      target: WASMD_PRECOMPILE_ENTRY,
      callData: encodedMsg,
    };
  }

  getPoolDataV3Call(poolKey: string): Multicall.CallStruct {
    const poolKeyInfo = parsePoolKey(poolKey);
    const queryInfo = {
      pool: {
        fee_tier: poolKeyInfo.fee_tier,
        token_0: poolKeyInfo.token_x,
        token_1: poolKeyInfo.token_y,
      },
    } as OraiswapV3Types.QueryMsg;

    const encodedMsg = IWasmd__factory.createInterface().encodeFunctionData(
      'query',
      [
        OraidexPoolDataProvider.ORAIDEX_V3_ADDRESS,
        Buffer.from(JSON.stringify(queryInfo)),
      ],
    );

    return {
      target: WASMD_PRECOMPILE_ENTRY,
      callData: encodedMsg,
    };
  }
}
