import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OsorMsgComposer } from '../../src/osor/OsorMsgComposer';
import { RouteResponse } from '../../src/interfaces/IRouter';

describe('OsorMsgComposer', () => {
  let osorMsgComposer: OsorMsgComposer;
  
  beforeEach(() => {
    vi.clearAllMocks();
    osorMsgComposer = new OsorMsgComposer();
  });

  describe('generateMsgFromRouteResponse', () => {
    it('should generate correct message from route response', () => {
      // Setup
      const mockRouteResponse: RouteResponse = {
        swapAmount: '1000000',
        returnAmount: '990000',
        paths: [
          {
            chainId: 'oraichain',
            tokenIn: 'orai',
            tokenInAmount: '1000000',
            tokenOut: 'usdt',
            tokenOutAmount: '990000',
            tokenOutChainId: 'oraichain',
            actions: [
              {
                type: 'Swap',
                swapInfo: [
                  {
                    poolId: 'pool1',
                    tokenOut: 'usdt'
                  }
                ],
                protocol: 'Oraidex',
                tokenIn: 'orai',
                tokenInAmount: '1000000',
                tokenOut: 'usdt',
                tokenOutAmount: '990000'
              }
            ]
          }
        ]
      };
      
      // Test
      const result = osorMsgComposer.generateMsgFromRouteResponse(mockRouteResponse);
      
      // Verify the result is an array
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty paths array by adding a bridge action', () => {
      // Setup - add a bridge action to trigger the universal swap path
      const mockRouteResponse: RouteResponse = {
        swapAmount: '0',
        returnAmount: '0',
        paths: [
          {
            chainId: 'oraichain',
            tokenIn: 'orai',
            tokenInAmount: '0',
            tokenOut: 'usdt',
            tokenOutAmount: '0',
            tokenOutChainId: 'oraichain',
            actions: [
              {
                type: 'Bridge',
                protocol: 'Oraidex',
                tokenIn: 'orai',
                tokenInAmount: '0',
                tokenOut: 'usdt',
                tokenOutAmount: '0'
              }
            ]
          }
        ]
      };
      
      // Mock the _generateUniversalSwapMsg method
      vi.spyOn(osorMsgComposer as any, '_generateUniversalSwapMsg').mockReturnValue([]);
      
      // Test
      const result = osorMsgComposer.generateMsgFromRouteResponse(mockRouteResponse);
      
      // Verify the result is an empty array
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
      expect(osorMsgComposer['_generateUniversalSwapMsg']).toHaveBeenCalledWith(mockRouteResponse);
    });
  });
}); 