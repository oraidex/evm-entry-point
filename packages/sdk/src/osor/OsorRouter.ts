import { z } from 'zod';
import {
  ActionRoute,
  Currency,
  CurrencyAmount,
  IRouter,
  RouteResponse,
  SwapOptions,
  TradeType,
} from '../interfaces/IRouter';
import { ApiClient } from '../ApiClient';
import { OsorSmartRouteResponse } from '../interfaces/IOsor';

type OSORRequestParams = {
  sourceAsset: string;
  sourceChainId: string;
  destAsset: string;
  destChainId: string;
  offerAmount: string;
} & {
  swapOptions: SwapOptions;
};

const OSORRequestSchema: z.ZodSchema<OSORRequestParams> = z.object({
  sourceAsset: z.string(),
  sourceChainId: z.string(),
  destAsset: z.string(),
  destChainId: z.string(),
  offerAmount: z.string(),
  swapOptions: z.object({
    protocols: z.array(
      z.union([
        z.literal('Oraidex'),
        z.literal('OraidexV3'),
        z.literal('Osmosis'),
      ]),
    ),
    maxSplits: z.number().optional(),
  }),
});

const defaultSwapOptions: SwapOptions = {
  protocols: ['Oraidex', 'OraidexV3'],
  maxSplits: 1,
};

export class OsorRouter extends IRouter<OsorSmartRouteResponse> {
  constructor(
    public osorUrl: string,
    public apiClient: ApiClient,
  ) {
    super();
  }
  async route<OsorSmartRouteResponse>(
    amount: CurrencyAmount,
    quoteCurrency: Currency,
    swapType: TradeType = TradeType.EXACT_INPUT,
    swapOptions: SwapOptions = defaultSwapOptions,
  ): Promise<OsorSmartRouteResponse | null> {
    if (swapType === TradeType.EXACT_INPUT) {
      const requestBody: OSORRequestParams = {
        sourceAsset: amount.currency.address,
        sourceChainId: amount.currency.chainId,
        destAsset: quoteCurrency.address,
        destChainId: quoteCurrency.chainId,
        offerAmount: amount.amount,
        swapOptions,
      };
      const validatedRequestBody = this._validateRequestBody(requestBody);
      const res = await this.apiClient.post<OsorSmartRouteResponse>(
        this.osorUrl,
        validatedRequestBody,
      );
      const smartRouteData = res.data;
      return smartRouteData;
    } else {
      throw new Error('Exact output have not supported yet');
    }
  }

  private _validateRequestBody(
    requestBody: OSORRequestParams,
  ): OSORRequestParams {
    const validateData = OSORRequestSchema.parse(requestBody);
    return validateData;
  }
}
