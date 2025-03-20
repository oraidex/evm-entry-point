# Oraichain EVM Entry Point

A monorepo project that provides EVM compatibility for Oraichain's CosmWasm DApps, specifically designed for OraiDEX. This project enables Ethereum-compatible interactions with Oraichain's CosmWasm smart contracts through precompiled modules.

## Project Structure

```
.
├── packages/            # Core packages
│   ├── contracts/       # Solidity smart contracts for EVM compatibility
│   ├── sdk/             # JavaScript/TypeScript SDK for interacting with the contracts
│   └── ui/              # UI components and widget for integration
```

## Packages

### 1. Contracts (`packages/contracts`)

The contracts package provides Solidity smart contracts that serve as an EVM entry point to interact with CosmWasm contracts on Oraichain.

**Key Features:**
- **Bridging EVM and CosmWasm:** Enables EVM-compatible chains to interact with CosmWasm contracts through precompiled modules.
- **Token Standards:** Implements various token standards for cross-chain compatibility:
  - `ERC20Native`: ERC20 representation of Oraichain native tokens
  - `CW20ERC20`: ERC20 interface for CW20 tokens on Oraichain
  - `NativeERC20`: Maps ERC20 interface to native Oraichain assets
- **Precompiled Interfaces:** Provides interfaces to Oraichain's precompiled modules:
  - `IWasmd`: Interface for CosmWasm module interactions
  - `IJson`: Helper for JSON parsing and manipulation
  - `IAddr`: Address conversion between EVM and Cosmos formats
  - `IBank`: Interface for bank module operations
  - `IAuthz`: Interface for authorization module
- **OraiDEX Integration:** Includes contracts for interacting with OraiDEX's pools and pairs

### 2. SDK (`packages/sdk`)

The SDK package provides a TypeScript library for developers to interact with the EVM entry point contracts and OraiDEX functionality.

**Key Features:**
- **OSOR (Oraichain Smart Order Router):** Optimized routing for token swaps on OraiDEX
- **API Client:** Simplified HTTP requests with built-in error handling
- **CosmWasm Integration:** Built-in support for CosmWasm message formats
- **Utilities:** Helper functions for common operations with Cosmos and EVM compatibility
- **TypeScript Support:** Full TypeScript support with type definitions

### 3. UI (`packages/ui`)

The UI package provides React components for integrating OraiDEX's swap functionality into any EVM-compatible dApp.

**Key Features:**
- **React Components:** Reusable UI components for OraiDEX integration
- **Widget:** Standalone widget for token swapping
- **RainbowKit Integration:** Wallet connection via RainbowKit
- **Responsive Design:** Mobile-friendly components using modern UI libraries

## Key Use Cases

1. **Token Bridging:** Use ERC20 representations of Oraichain native tokens on EVM chains.
2. **Cross-Chain DeFi:** Access OraiDEX's liquidity pools from EVM-compatible chains.
3. **Unified Interface:** Build applications that work seamlessly across EVM and Cosmos ecosystems.
4. **Developer Tools:** Leverage the SDK to build custom applications with OraiDEX integration.

## Development

The project uses a modern monorepo setup with the following tools:
- [pnpm](https://pnpm.io) as package manager
- [Turborepo](https://turbo.build/repo) for monorepo management
- [Changesets](https://github.com/changesets/changesets) for versioning and changelogs
- [TypeScript](https://www.typescriptlang.org/) for all packages
- [Hardhat](https://hardhat.org/) and [Foundry](https://getfoundry.sh/) for smart contract development

## Getting Started

### Installation

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Development

```bash
pnpm dev:watch
```

### Testing

```bash
pnpm test
```

## Contributing

Please refer to [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.




