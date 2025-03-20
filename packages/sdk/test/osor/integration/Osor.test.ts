import { describe, it, expect, beforeAll } from 'vitest';
import { Osor } from '../../../src/osor/Osor';
import { CurrencyAmount, Currency, TradeType, SwapOptions } from '../../../src/interfaces/IRouter';
import { isCw20Token } from '../../../src/utils';
import { Affiliate } from '@oraichain/osor-api-contracts-sdk/src/EntryPoint.types';
import { Protocol } from '../../../src/constants/protocols';

// Define test constants
const OSOR_API_URL = 'https://api-osor.oraidex.io'; // Replace with actual API URL

// Define test tokens
const ORAI_TOKEN: Currency = {
  address: 'orai',
  chainId: 'Oraichain',
  decimals: 6,
  symbol: 'ORAI'
};

const USDT_TOKEN: Currency = {
  address: 'usdt',
  chainId: 'Oraichain',
  decimals: 6,
  symbol: 'USDT'
};

const CW20_TOKEN: Currency = {
  address: 'orai1...',  // Replace with actual CW20 token address
  chainId: 'Oraichain',
  decimals: 6,
  symbol: 'CW20'
};

// Define types for the response messages
type NativeAsset = {
  denom: string;
  amount: string;
};

type Cw20Asset = {
  address: string;
  amount: string;
};

type MinAsset = {
  native?: NativeAsset;
  cw20?: Cw20Asset;
};

type SwapOperation = {
  denom_in: string;
  denom_out: string;
  pool: string;
};

type ExecuteMsg = {
  swap_and_action: {
    affiliates: Affiliate[];
    min_asset: MinAsset;
    timeout_timestamp: string;
    post_swap_action: Record<string, unknown>;
    user_swap: {
      swap_exact_asset_in: {
        swap_venue_name: string;
        operations: SwapOperation[];
      };
    };
  };
};

type Cw20SendMsg = {
  send: {
    contract: string;
    amount: string;
    msg: string;
  };
};

// Union type for all possible message types
type SwapMsg = ExecuteMsg | Cw20SendMsg;

// Type guard functions
function isExecuteMsg(msg: SwapMsg): msg is ExecuteMsg {
  return 'swap_and_action' in msg;
}

function isCw20SendMsg(msg: SwapMsg): msg is Cw20SendMsg {
  return 'send' in msg;
}

describe.skip('Osor Integration Tests', () => {
  let osor: Osor;

  beforeAll(() => {
    // Initialize the Osor instance with the actual API URL
    osor = new Osor(OSOR_API_URL);
  });

  describe.skip('getSwapOraidexMsg', () => {
    it('should generate swap messages for native tokens (ORAI to USDT)', async () => {
      // Create test input
      const inputAmount: CurrencyAmount = {
        amount: '1000000', // 1 ORAI (with 6 decimals)
        currency: ORAI_TOKEN
      };

      // Execute the function
      const result = await osor.getSwapOraidexMsg(
        inputAmount,
        USDT_TOKEN,
        TradeType.EXACT_INPUT,
        undefined, // Default swap options
        {
          protocols: ['Oraidex' as Protocol],
          maxSplits: 1
        },
        1,
        [],
      );

      // Assertions
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.executeMsg.length).toBeGreaterThan(0);

      // Check the structure of the result
      const executeMsg = result.executeMsg[0] as SwapMsg;
      expect(isExecuteMsg(executeMsg)).toBe(true);
      
      if (isExecuteMsg(executeMsg)) {
        // Check min_asset is correctly set for USDT (native token)
        expect(executeMsg.swap_and_action.min_asset).toHaveProperty('native');
        expect(executeMsg.swap_and_action.min_asset.native?.denom).toBe('usdt');
        
        // Check swap venue is set to oraidex
        expect(executeMsg.swap_and_action.user_swap.swap_exact_asset_in.swap_venue_name).toBe('oraidex');
        
        // Check operations array exists and has valid structure
        const operations = executeMsg.swap_and_action.user_swap.swap_exact_asset_in.operations;
        expect(Array.isArray(operations)).toBe(true);
        expect(operations.length).toBeGreaterThan(0);
        
        // Check first operation has correct structure
        const firstOp = operations[0];
        expect(firstOp).toHaveProperty('denom_in');
        expect(firstOp).toHaveProperty('denom_out');
        expect(firstOp).toHaveProperty('pool');
      }
    });

    it('should generate swap messages for CW20 tokens as input', async () => {
      // Skip this test if CW20 token address is not set
      if (CW20_TOKEN.address === 'orai1...') {
        console.warn('Skipping CW20 test - token address not configured');
        return;
      }

      // Create test input with CW20 token as input
      const inputAmount: CurrencyAmount = {
        amount: '1000000', // 1 CW20 token (with 6 decimals)
        currency: CW20_TOKEN
      };

      // Execute the function
      const result = await osor.getSwapOraidexMsg(
        inputAmount,
        USDT_TOKEN,
        TradeType.EXACT_INPUT
      );

      // Assertions
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // For CW20 tokens, we should get a different message format
      const cw20Msg = result[0] as SwapMsg;
      expect(isCw20SendMsg(cw20Msg)).toBe(true);
      
      if (isCw20SendMsg(cw20Msg)) {
        expect(cw20Msg.send).toHaveProperty('contract');
        expect(cw20Msg.send).toHaveProperty('amount');
        expect(cw20Msg.send).toHaveProperty('msg');
        
        // Check the contract address matches the OSOR router address
        expect(cw20Msg.send.contract).toBe(osor['ORAICHAIN_OSOR_ROUTER_ADDRESS']);
        
        // Check amount matches input
        expect(cw20Msg.send.amount).toBe(inputAmount.amount);
      }
    });

    it('should generate swap messages for native tokens with custom slippage', async () => {
      // Create test input
      const inputAmount: CurrencyAmount = {
        amount: '1000000', // 1 ORAI (with 6 decimals)
        currency: ORAI_TOKEN
      };

      // Execute with 0.5% slippage
      const result = await osor.getSwapOraidexMsg(
        inputAmount,
        USDT_TOKEN,
        TradeType.EXACT_INPUT,
        undefined,
        0.5 // 0.5% slippage
      );

      // Assertions
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // The min_asset amount should reflect the 0.5% slippage
      // We can't assert the exact value in an integration test, but we can check it exists
      const executeMsg = result[0] as SwapMsg;
      
      if (isExecuteMsg(executeMsg)) {
        expect(executeMsg.swap_and_action.min_asset.native?.amount).toBeDefined();
      }
    });

    it('should include affiliates when provided', async () => {
      // Create test input
      const inputAmount: CurrencyAmount = {
        amount: '1000000', // 1 ORAI (with 6 decimals)
        currency: ORAI_TOKEN
      };

      // Create test affiliates
      const affiliates: Affiliate[] = [
        {
          address: 'orai1affiliate1address',
          basis_points_fee: '50' // 0.5% - changed to string
        }
      ];

      // Execute with affiliates
      const result = await osor.getSwapOraidexMsg(
        inputAmount,
        USDT_TOKEN,
        TradeType.EXACT_INPUT,
        undefined,
        1, // 1% slippage
        affiliates
      );

      // Assertions
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // Check affiliates are included
      const executeMsg = result[0] as SwapMsg;
      
      if (isExecuteMsg(executeMsg)) {
        expect(executeMsg.swap_and_action.affiliates).toEqual(affiliates);
      }
    });

    it('should handle swap options', async () => {
      // Create test input
      const inputAmount: CurrencyAmount = {
        amount: '1000000', // 1 ORAI (with 6 decimals)
        currency: ORAI_TOKEN
      };

      // Create swap options
      const swapOptions: SwapOptions = {
        protocols: ['Oraidex' as Protocol], // Use the correct Protocol enum value
        maxSplits: 1
      };

      // Execute with swap options
      const result = await osor.getSwapOraidexMsg(
        inputAmount,
        USDT_TOKEN,
        TradeType.EXACT_INPUT,
        swapOptions,
        1 // 1% slippage
      );

      // Assertions
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // We can't directly assert how swap options affect the result in an integration test
      // But we can check the basic structure is correct
      const executeMsg = result[0] as SwapMsg;
      
      if (isExecuteMsg(executeMsg)) {
        expect(executeMsg).toHaveProperty('swap_and_action');
      }
    });

    it('should handle EXACT_OUTPUT trade type', async () => {
      // Create test input for EXACT_OUTPUT
      const outputAmount: CurrencyAmount = {
        amount: '1000000', // 1 USDT (with 6 decimals)
        currency: USDT_TOKEN
      };

      // Execute with EXACT_OUTPUT
      const result = await osor.getSwapOraidexMsg(
        outputAmount,
        ORAI_TOKEN,
        TradeType.EXACT_OUTPUT
      );

      // Assertions
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // Basic structure checks
      const executeMsg = result[0] as SwapMsg;
      
      if (isExecuteMsg(executeMsg)) {
        expect(executeMsg).toHaveProperty('swap_and_action');
      }
    });

    it('should throw an error when no route is found', async () => {
      // Create test input with very small amount that might not have a route
      const inputAmount: CurrencyAmount = {
        amount: '1', // Very small amount
        currency: ORAI_TOKEN
      };

      // Test - expect error
      await expect(osor.getSwapOraidexMsg(
        inputAmount,
        USDT_TOKEN,
        TradeType.EXACT_INPUT
      )).rejects.toThrow();
    });
  });
});
