import { describe, it, beforeAll } from 'vitest';
import { OraidexPoolDataProvider } from '../../../src/oraidex/OraidexPoolDataProvider';
import { GetPoolDataArg } from '../../../src/interfaces/IPoolDataProvider';
import { JsonRpcProvider } from 'ethers';
import { MULTICALL_ADDRESS } from '../../../src/constants/addresses';

// Define test constants
const JSON_RPC_URL = 'https://evm.orai.io/';

describe('OraidexPoolDataProvider Integration Test', () => {
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

  it('should get pool data', async () => {
    const poolArgs: GetPoolDataArg[] = [
      {
        protocol: 'Oraidex',
        poolKey: 'orai1m6q5k5nr2eh8q0rdrf57wr7phk7uvlpg7mwfv5',
      },
      {
        protocol: 'Oraidex',
        poolKey: 'orai1jf74ry4m0jcy9emsaudkhe7vte9l8qy8enakvs',
      },
      {
        protocol: 'Oraidex',
        poolKey: 'orai1c5s03c3l336dgesne7dylnmhszw8554tsyy9yt',
      },
      {
        protocol: 'OraidexV3',
        poolKey:
          'orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100',
      },
      {
        protocol: 'OraidexV3',
        poolKey:
          'orai-orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh-3000000000-100',
      },
    ];
    const result = await provider.getPoolData(poolArgs);
    console.log(result);
  });
});
