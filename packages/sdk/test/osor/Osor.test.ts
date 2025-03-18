import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Osor } from '../../src/osor/Osor';
import { ApiClient } from '../../src/ApiClient';
import { OsorRouter } from '../../src/osor/OsorRouter';
import { OsorMsgComposer } from '../../src/osor/OsorMsgComposer';
import { CurrencyAmount, Currency, TradeType, SwapOptions } from '../../src/interfaces/IRouter';
import { OsorSmartRouteResponse } from '../../src/interfaces/IOsor';
import { isCw20Token } from '../../src/utils';
import { Affiliate } from '@oraichain/osor-api-contracts-sdk/src/EntryPoint.types';

// Mock dependencies
vi.mock('../../src/ApiClient');
vi.mock('../../src/osor/OsorRouter');
vi.mock('../../src/osor/OsorMsgComposer');
vi.mock('../../src/utils', () => ({
  isCw20Token: vi.fn(),
  toBinary: vi.fn((data) => JSON.stringify(data)),
  calculateTimeoutTimestamp: vi.fn(() => '1000000000')
}));

// Define a type for the ExecuteMsg to avoid import issues
type ExecuteMsg = {
  swap_and_action: {
    affiliates: Affiliate[];
    min_asset: {
      native?: {
        amount: string;
        denom: string;
      };
      cw20?: {
        address: string;
        amount: string;
      };
    };
    timeout_timestamp: number;
    post_swap_action: Record<string, unknown>;
    user_swap: {
      swap_exact_asset_in: {
        swap_venue_name: string;
        operations: Array<{
          denom_in: string;
          denom_out: string;
          pool: string;
        }>;
      };
    };
  };
};

describe('Osor', () => {
  let osor: Osor;
  const mockOsorUrl = 'https://mock-osor-api.com';
  
  beforeEach(() => {
    vi.clearAllMocks();
    osor = new Osor(mockOsorUrl);
  });

  describe('constructor', () => {
    it('should initialize with the correct URL and create required instances', () => {
      expect(osor['osorUrl']).toBe(mockOsorUrl);
      expect(osor['apiClient']).toBeInstanceOf(ApiClient);
      expect(osor.osorRouter).toBeInstanceOf(OsorRouter);
      expect(osor.osorMsgComposer).toBeInstanceOf(OsorMsgComposer);
    });
  });

  describe('getSwapOraidexMsg', () => {
    // Common test setup
    const mockAmount = { 
      amount: '1000000', 
      currency: { 
        address: 'orai',
        chainId: 'oraichain',
        decimals: 6,
        symbol: 'ORAI'
      } 
    } as CurrencyAmount;
    
    const mockQuoteCurrency = { 
      address: 'usdt',
      chainId: 'oraichain',
      decimals: 6,
      symbol: 'USDT'
    } as Currency;

    const mockCw20Amount = {
      amount: '1000000',
      currency: {
        address: 'orai1234cw20token',
        chainId: 'oraichain',
        decimals: 6,
        symbol: 'CW20'
      }
    } as CurrencyAmount;

    const mockRouteResponse: OsorSmartRouteResponse = {
      swapAmount: '1000000',
      returnAmount: '2000000',
      routes: [
        {
          swapAmount: '1000000',
          returnAmount: '2000000',
          paths: [
            {
              chainId: 'oraichain',
              tokenIn: 'orai',
              tokenInAmount: '1000000',
              tokenOut: 'usdt',
              tokenOutAmount: '2000000',
              tokenOutChainId: 'oraichain',
              actions: [
                {
                  type: 'Swap',
                  protocol: 'Oraidex',
                  tokenIn: 'orai',
                  tokenInAmount: '1000000',
                  tokenOut: 'usdt',
                  tokenOutAmount: '2000000',
                  swapInfo: [
                    {
                      poolId: 'orai_usdt_pool',
                      tokenOut: 'usdt'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const mockSwapOps = [
      {
        denom_in: 'orai',
        denom_out: 'usdt',
        pool: 'orai_usdt_pool'
      }
    ];

    it('should throw an error when no route is found', async () => {
      // Mock the route method to return null
      vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(null);
      
      // Test - expect the actual error message from the implementation
      await expect(osor.getSwapOraidexMsg(
        mockAmount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT
      )).rejects.toThrow('Failed to route swap');
    });

    it('should successfully generate swap messages for native tokens', async () => {
      // Setup
      vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(mockRouteResponse);
      vi.mocked(isCw20Token).mockReturnValue(false);
      vi.spyOn(osor.osorMsgComposer, 'generateMsgFromRouteResponse').mockReturnValue(mockSwapOps);
      
      // Execute
      const result = await osor.getSwapOraidexMsg(
        mockAmount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT
      );
      
      // Verify
      expect(result.executeMsg).toHaveLength(1);
      const executeMsg = result.executeMsg[0] as ExecuteMsg;
      expect(executeMsg).toHaveProperty('swap_and_action');
      expect(executeMsg.swap_and_action).toHaveProperty('min_asset');
      expect(executeMsg.swap_and_action.min_asset).toHaveProperty('native');
      expect(executeMsg.swap_and_action.min_asset.native!.denom).toBe('usdt');
      expect(executeMsg.swap_and_action.user_swap.swap_exact_asset_in.operations).toEqual(mockSwapOps);
    });

    it('should successfully generate swap messages for CW20 tokens as input', async () => {
      // Setup
      vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(mockRouteResponse);
      vi.mocked(isCw20Token).mockImplementation((address) => address === 'orai1234cw20token');
      vi.spyOn(osor.osorMsgComposer, 'generateMsgFromRouteResponse').mockReturnValue(mockSwapOps);
      
      // Execute
      const result = await osor.getSwapOraidexMsg(
        mockCw20Amount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT
      );
      
      // Verify
      expect(result.executeMsg).toHaveLength(1);
      // For CW20 tokens, we get a different message format
      const cw20Msg = result.executeMsg[0] as { send: { contract: string; amount: string; msg: string } };
      expect(cw20Msg).toHaveProperty('send');
      expect(cw20Msg.send.contract).toBe(osor['ORAICHAIN_OSOR_ROUTER_ADDRESS']);
      expect(cw20Msg.send.amount).toBe('1000000');
      // The msg should be a binary representation of the swap message
      expect(cw20Msg.send.msg).toBeTruthy();
    });

    it('should successfully generate swap messages for CW20 tokens as output', async () => {
      // Setup
      const mockCw20QuoteCurrency = {
        address: 'orai1234cw20token',
        chainId: 'oraichain',
        decimals: 6,
        symbol: 'CW20'
      } as Currency;
      
      vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(mockRouteResponse);
      vi.mocked(isCw20Token).mockImplementation((address) => address === 'orai1234cw20token');
      vi.spyOn(osor.osorMsgComposer, 'generateMsgFromRouteResponse').mockReturnValue(mockSwapOps);
      
      // Execute
      const result = await osor.getSwapOraidexMsg(
        mockAmount,
        mockCw20QuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT
      );
      
      // Verify
      expect(result.executeMsg).toHaveLength(1);
      const executeMsg = result.executeMsg[0] as ExecuteMsg;
      expect(executeMsg).toHaveProperty('swap_and_action');
      expect(executeMsg.swap_and_action).toHaveProperty('min_asset');
      expect(executeMsg.swap_and_action.min_asset).toHaveProperty('cw20');
      expect(executeMsg.swap_and_action.min_asset.cw20!.address).toBe('orai1234cw20token');
    });

    it('should apply custom slippage tolerance', async () => {
      // Setup
      vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(mockRouteResponse);
      vi.mocked(isCw20Token).mockReturnValue(false);
      vi.spyOn(osor.osorMsgComposer, 'generateMsgFromRouteResponse').mockReturnValue(mockSwapOps);
      
      // Execute with 0.5% slippage
      const result = await osor.getSwapOraidexMsg(
        mockAmount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT,
        undefined,
        0.5
      );
      
      // Verify - with 0.5% slippage, min amount should be 99.5% of return amount
      const executeMsg = result.executeMsg[0] as ExecuteMsg;
      expect(executeMsg.swap_and_action.min_asset.native!.amount).toBe('1990000');
    });

    it('should include affiliates when provided', async () => {
      // Setup
      vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(mockRouteResponse);
      vi.mocked(isCw20Token).mockReturnValue(false);
      vi.spyOn(osor.osorMsgComposer, 'generateMsgFromRouteResponse').mockReturnValue(mockSwapOps);
      
      const mockAffiliates: Affiliate[] = [
        {
          address: 'orai1affiliate',
          basis_points_fee: '30'
        }
      ];
      
      // Execute
      const result = await osor.getSwapOraidexMsg(
        mockAmount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT,
        undefined,
        1,
        mockAffiliates
      );
      
      // Verify
      const executeMsg = result.executeMsg[0] as ExecuteMsg;
      expect(executeMsg.swap_and_action.affiliates).toEqual(mockAffiliates);
    });

    it('should pass swap options to router', async () => {
      // Setup
      const routeSpy = vi.spyOn(osor.osorRouter, 'route').mockResolvedValue(mockRouteResponse);
      vi.mocked(isCw20Token).mockReturnValue(false);
      vi.spyOn(osor.osorMsgComposer, 'generateMsgFromRouteResponse').mockReturnValue(mockSwapOps);
      
      const mockSwapOptions: SwapOptions = {
        protocols: ['OraidexV3'],
        maxSplits: 2
      };
      
      // Execute
      await osor.getSwapOraidexMsg(
        mockAmount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT,
        mockSwapOptions
      );
      
      // Verify
      expect(routeSpy).toHaveBeenCalledWith(
        mockAmount,
        mockQuoteCurrency,
        TradeType.EXACT_INPUT,
        mockSwapOptions
      );
    });

    it('should handle errors during route execution', async () => {
      // Setup
      vi.spyOn(osor.osorRouter, 'route').mockImplementation(() => {
        throw new Error('Network error');
      });
      
      // Test
      await expect(osor.getSwapOraidexMsg(
        mockAmount,
        mockQuoteCurrency,
        'recipient123',
        TradeType.EXACT_INPUT
      )).rejects.toThrow('Failed to route swap');
    });
  });
}); 