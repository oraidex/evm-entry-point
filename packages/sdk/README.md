# Oraichain EVM SDK

[![npm version](https://img.shields.io/npm/v/@oraichain/oraichain-evm-sdk.svg)](https://www.npmjs.com/package/@oraichain/oraichain-evm-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript SDK for interacting with ORAIDEX on EVM-compatible blockchains through precompile Wasmd module in blockchain. All messages here were build in cosmwasm format.

## Installation

```bash
npm install @oraichain/oraichain-evm-sdk
# or
yarn add @oraichain/oraichain-evm-sdk
```

## Features

- **OSOR (Oraichain Smart Order Router)**: Optimized routing for token swaps on ORAIDEX
- **API Client**: Simplified HTTP requests with built-in error handling
- **Utilities**: Helper functions for common operations with Cosmos and EVM compatibility
- **CosmWasm Integration**: Built-in support for CosmWasm message formats

## Usage

### Basic Setup

```typescript
import { Osor } from '@oraichain/oraichain-evm-sdk';

// Initialize the OSOR client with the API URL
const osorUrl = 'https://api.oraidex.io';
const osor = new Osor(osorUrl);
```

### Return ExecuteMsg Swap

```typescript
import { 
  Osor, 
  CurrencyAmount, 
  Currency, 
  TradeType 
} from '@oraichain/oraichain-evm-sdk';

// Initialize the OSOR client
const osor = new Osor('https://api.oraidex.io');

// Define the swap parameters
const inputAmount = new CurrencyAmount({
  amount: '1000000', // Amount in smallest unit
  currency: {
    address: 'orai1k0y373yxqne22pc9g7jvnr4qulw5gfwyw0k7sp',  // Token address in bech32 format
    decimals: 6,
    symbol: 'USDT',
    chainId: 1
  }
});

const outputCurrency = new Currency({
  address: 'orai',  // Native ORAI coin
  decimals: 6,
  symbol: 'ORAI',
  chainId: 1
});

// Generate swap messages
const swapMsg = await osor.getSwapOraidexMsg(
  inputAmount,
  outputCurrency,
  TradeType.EXACT_INPUT,
  {}, // Swap options
  1, // Slippage tolerance (%)
  [] // Affiliates
);

// Use the generated message in your transaction
console.log(swapMsg);
```

### Using the API Client

```typescript
import { ApiClient } from '@oraichain/oraichain-evm-sdk';

const apiClient = new ApiClient({
  baseURL: 'https://api.oraidex.io',
});

// Make a GET request
const response = await apiClient.get('/path/to/endpoint');
console.log(response.data);

// Make a POST request with CosmWasm message
const postResponse = await apiClient.post('/path/to/endpoint', {
  token: 'orai1k0y373yxqne22pc9g7jvnr4qulw5gfwyw0k7sp',
  amount: '1000000'
});
console.log(postResponse.data);
```

## API Reference

### Osor Class

The main class for interacting with the ORAIDEX Smart Order Router through CosmWasm messages.

#### Methods

- `getSwapOraidexMsg(amount, quoteCurrency, swapType, swapOptions, slippageTolerance, affiliates)`: Generates CosmWasm-formatted swap messages for ORAIDEX using the OSOR router.

### OsorRouter Class

Handles routing logic for finding optimal swap paths on ORAIDEX.

### OsorMsgComposer Class

Composes CosmWasm-formatted messages for different types of operations on ORAIDEX.

### ApiClient Class

A wrapper around Axios for making HTTP requests with standardized error handling and CosmWasm message support.

#### Methods

- `get(url, config)`: Make a GET request
- `post(url, data, config)`: Make a POST request
- `put(url, data, config)`: Make a PUT request
- `delete(url, config)`: Make a DELETE request
- `patch(url, data, config)`: Make a PATCH request

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Lint the code
npm run lint

# Format the code
npm run format
```

## License

MIT 