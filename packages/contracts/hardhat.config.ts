import "@nomicfoundation/hardhat-toolbox";
import config from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

config.config();

const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    oraichain: {
      url: "https://evm.orai.io/",
      chainId: 108160679,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY || ""]
        : { mnemonic: process.env.MNEMONIC || "" },
    },
  },
};

export default hardhatConfig;
