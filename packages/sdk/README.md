# Oraichain EVM SDK

[![npm version](https://img.shields.io/npm/v/@oraichain/oraichain-evm-sdk.svg)](https://www.npmjs.com/package/@oraichain/oraichain-evm-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript SDK for interacting with Oraichain on EVM-compatible blockchains.

## Installation

```bash
npm install @oraichain/oraichain-evm-sdk
# or
yarn add @oraichain/oraichain-evm-sdk
```

## Features

- **OSOR (Oraichain Smart Order Router)**: Optimized routing for token swaps
- **API Client**: Simplified HTTP requests with built-in error handling
- **Utilities**: Helper functions for common operations

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
  amount: '1000000', // Amount in smallest unit (e.g., wei)
  currency: {
    address: '0x...',  // Token address
    decimals: 18,
    symbol: 'TOKEN',
    chainId: 1
  }
});

const outputCurrency = new Currency({
  address: '0x...',  // Output token address
  decimals: 18,
  symbol: 'USDT',
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

// Make a POST request
const postResponse = await apiClient.post('/path/to/endpoint', { key: 'value' });
console.log(postResponse.data);
```

## API Reference

### Osor Class

The main class for interacting with the Oraichain Smart Order Router.

#### Methods

- `getSwapOraidexMsg(amount, quoteCurrency, swapType, swapOptions, slippageTolerance, affiliates)`: Generates swap messages for Oraidex using the OSOR router.

### OsorRouter Class

Handles routing logic for finding optimal swap paths.

### OsorMsgComposer Class

Composes messages for different types of operations on Oraidex.

### ApiClient Class

A wrapper around Axios for making HTTP requests with standardized error handling.

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