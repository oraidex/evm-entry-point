---
"@oraichain/oraidex-evm-sdk": patch
"@oraichain/oraidex-evm-widget": patch
---

feat: integrate axios for API calls and enhance balance and price fetching - Added axios for making API requests to the new ORAIDEX API - Implemented getBalances and getPrices functions to fetch token balances and prices - Updated SelectTokenWithAmount component to display fetched balances and prices - Introduced useBalance and usePrice hooks for managing balance and price data - Enhanced getTokenList function to handle errors and return an empty array on failure - Added utility function formatLargeNumber for formatting large numbers in a user-friendly way - Updated contract addresses and HTTP endpoints for better configuration management
