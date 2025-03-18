# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

## Install dependencies

```bash
# for those who use nvm
corepack enable

# for those who don't
npm install -g pnpm
```

```shell
# update forge to latest version
foundryup

npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts

# Run test all
pnpm test
```
