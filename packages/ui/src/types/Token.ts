export interface Token {
  address: {
    cosmos: string;
    evm: string;
  };
  name: string;
  symbol: string;
  decimals: {
    cosmos: number;
    evm: number;
  };
  image?: string;
}
