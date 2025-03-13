import { SmartRouteConfig } from "./interfaces/IOsor";

type OSORRequestParams = {
    sourceAsset: string;
    sourceChainId: string;
    destAsset: string;
    destChainId: string;
    offerAmount: string;
  } & SmartRouteConfig;


const OSORRequestSchema: z.ZodSchema<OSORRequestParams> = z.object({
    sourceAsset: z.string(),
    sourceChainId: z.string(),
    destAsset: z.string(),
    destChainId: z.string(),
    offerAmount: z.string(),
    swapOptions: z.object({
      protocols: z.array(
        z.union([
          z.literal("Oraidex"),
          z.literal("OraidexV3"),
          z.literal("Osmosis"),
        ])
      ),
      maxSplits: z.number().optional(),
    }),
  });
  
  export class OSORRequestBuilder {
    data: OSORRequestParams = {
      sourceAsset: "",
      sourceChainId: "Oraichain",
      destAsset: "",
      destChainId: "Oraichain",
      offerAmount: "",
      swapOptions: {
        protocols: ["Oraidex", "OraidexV3"],
        maxSplits: 1,
      },
    };
    constructor(protected osorUrl: string) {}
  
    addSourceToken(token: Token): this {
      this.data = {
        ...this.data,
        sourceAsset: token.address,
        sourceChainId: token.chainId,
      };
      return this;
    }
  
    addDestToken(token: Token): this {
      this.data = {
        ...this.data,
        destAsset: token.address,
        destChainId: token.chainId,
      };
      return this;
    }
  
    addAmount(amount: bigint): this {
      this.data = {
        ...this.data,
        offerAmount: amount.toString(),
      };
      return this;
    }
  
    addMaxSplits(maxSplits: number): this {
      this.data = {
        ...this.data,
        swapOptions: {
          ...this.data.swapOptions,
          maxSplits,
        },
      };
      return this;
    }
  
    addProtocols(protocols: Protocols[]): this {
      this.data = {
        ...this.data,
        swapOptions: {
          ...this.data.swapOptions,
          protocols: protocols,
        },
      };
      return this;
    }
  
    build(): AxiosRequestConfig {
      const validateData = OSORRequestSchema.parse(this.data);
      return {
        method: "POST",
        url: this.osorUrl,
        data: validateData,
        timeout: 10000,
        timeoutErrorMessage: "OSOR request timeout",
      };
    }
  }
  