import "@nomicfoundation/hardhat-toolbox";
import config from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { ethers } from "ethers";
config.config();

let privateKeys: string[] = [];
for (let i = 0; i < 20; i++) {
  const wallet = ethers.Wallet.createRandom();
  privateKeys = [...privateKeys, wallet.privateKey];
}

const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    oraichain: {
      url: "https://evm.orai.io/",
      chainId: 108160679,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY || "", ...privateKeys]
        : { mnemonic: process.env.MNEMONIC || "" },
    },
    testing: {
      url: "http://127.0.0.1:8545",
      chainId: 3481324938,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY || "", ...privateKeys]
        : { mnemonic: process.env.MNEMONIC || "" },
    },
  },
};

export default hardhatConfig;
