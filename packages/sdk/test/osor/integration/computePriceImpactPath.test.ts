import { describe, it, beforeAll } from 'vitest';
import { OraidexPoolDataProvider } from '../../../src/oraidex/OraidexPoolDataProvider';
import { JsonRpcProvider } from 'ethers';
import { MULTICALL_ADDRESS } from '../../../src/constants/addresses';
import { computePriceImpactRoute } from '../../../src/libs';
import { OsorSmartRouteResponse, Route } from '../../../src';
import { computePriceImpactFromOsorResponse } from '../../../src/osor/osorPriceImpact';

// Define test constants
const JSON_RPC_URL = 'https://evm.orai.io/';

describe('computePriceImpact Integration Test', () => {
  let provider: OraidexPoolDataProvider;
  let jsonRpcProvider: JsonRpcProvider;

  beforeAll(() => {
    // Configure the provider with explicit network information and disable ENS
    jsonRpcProvider = new JsonRpcProvider(JSON_RPC_URL);
    provider = new OraidexPoolDataProvider(jsonRpcProvider, {
      multicallAddress: MULTICALL_ADDRESS,
      chunkSize: 10, // Use a smaller chunk size for testing
    });
  });

  it('computePriceImpactRoute', async () => {
    const path: Route = {
      swapAmount: '7500000',
      returnAmount: '21623274',
      paths: [
        {
          chainId: 'Oraichain',
          tokenIn: 'orai',
          tokenInAmount: '7500000',
          tokenOut:
            'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
          tokenOutAmount: '21623274',
          tokenOutChainId: 'Oraichain',
          actions: [
            {
              type: 'Swap',
              protocol: 'Oraidex',
              tokenIn: 'orai',
              tokenInAmount: '7500000',
              tokenOut:
                'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
              tokenOutAmount: '21623274',
              swapInfo: [
                {
                  poolId:
                    'orai19ttg0j7w5kr83js32tmwnwxxdq9rkmw4m3d7mn2j2hkpugwwa4tszwsnkg',
                  tokenOut:
                    'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await computePriceImpactRoute(path, provider);
    console.log(result);
  });

  it('computePriceImpactFromOsorResponse', async () => {
    const osorResponse: OsorSmartRouteResponse = {
      swapAmount: '10000000',
      returnAmount: '28839351',
      routes: [
        {
          swapAmount: '7500000',
          returnAmount: '21623274',
          paths: [
            {
              chainId: 'Oraichain',
              tokenIn: 'orai',
              tokenInAmount: '7500000',
              tokenOut:
                'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
              tokenOutAmount: '21623274',
              tokenOutChainId: 'Oraichain',
              actions: [
                {
                  type: 'Swap',
                  protocol: 'Oraidex',
                  tokenIn: 'orai',
                  tokenInAmount: '7500000',
                  tokenOut:
                    'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
                  tokenOutAmount: '21623274',
                  swapInfo: [
                    {
                      poolId:
                        'orai19ttg0j7w5kr83js32tmwnwxxdq9rkmw4m3d7mn2j2hkpugwwa4tszwsnkg',
                      tokenOut:
                        'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          swapAmount: '2500000',
          returnAmount: '7216077',
          paths: [
            {
              chainId: 'Oraichain',
              tokenIn: 'orai',
              tokenInAmount: '2500000',
              tokenOut:
                'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
              tokenOutAmount: '7216077',
              tokenOutChainId: 'Oraichain',
              actions: [
                {
                  type: 'Swap',
                  protocol: 'Oraidex',
                  tokenIn: 'orai',
                  tokenInAmount: '2500000',
                  tokenOut:
                    'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
                  tokenOutAmount: '7216077',
                  swapInfo: [
                    {
                      poolId: 'orai1m6q5k5nr2eh8q0rdrf57wr7phk7uvlpg7mwfv5',
                      tokenOut: 'orai1lus0f0rhx8s03gdllx2n6vhkmf0536dv57wfge',
                    },
                    {
                      poolId:
                        'orai1n4edv5h86rawzrvhy8lmrmnnmmherxnhuwqnk3yuvt0wgclh75usyn3md6',
                      tokenOut:
                        'orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const result = await computePriceImpactFromOsorResponse(
      osorResponse,
      provider,
    );
    console.log({ result });
  });
});
