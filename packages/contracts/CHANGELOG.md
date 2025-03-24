# @oraichain/evm-entry-point

## 0.2.1

### Patch Changes

- [#36](https://github.com/oraidex/evm-entry-point/pull/36) [`4e58006`](https://github.com/oraidex/evm-entry-point/commit/4e58006cf284ce96e936aa1b75e0f90003384002) Thanks [@perfogic](https://github.com/perfogic)! - This This adds event emitter functionality for the transfer function in the ERC20 native upgradeable contract, ensuring proper event tracking and monitoring of token transfers across the network. This enhancement improves transparency and compatibility with existing EVM tooling and infrastructure. The implementation follows ERC20 standards and best practices, emitting Transfer events that can be easily tracked by block explorers, wallets, and other blockchain monitoring tools. This update is crucial for maintaining interoperability with the broader Ethereum ecosystem and enabling seamless integration with various DeFi protocols and applications. The event emission ensures accurate transaction history tracking and enables better user experience through improved transaction visibility and confirmation.
