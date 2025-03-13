export type QuoteResult = {
    amountOut: string;
}



export interface Quoter {
    quoteExactInput(amountIn:string | BigInt | number,): Promise<QuoteResult>;
    quoteExactOutput(params: OSORRequestParams): Promise<QuoteResult>;
}