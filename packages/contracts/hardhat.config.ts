import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import config from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { ethers } from "ethers";
import fs from "fs"; // Use promises API for async file reading
config.config();

let privateKeys: string[] = [];
for (let i = 0; i < 20; i++) {
  const wallet = ethers.Wallet.createRandom();
  privateKeys = [...privateKeys, wallet.privateKey];
}

/**
 * Extract mnemonic from account key file. Eg: account-eth.txt from wasmd when running ./scripts/setup_oraid.sh
 * @param filePath - path to the account key file
 * @returns mnemonic
 */
function extractMnemonicFromAccountKeyFile(filePath: string): string {
  try {
    // Read the file content synchronously as a string
    const content = fs.readFileSync(filePath, "utf-8");

    // Split the content into lines and filter out empty lines
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    // Return the last line (the mnemonic)
    return lines[lines.length - 1];
  } catch (error) {
    console.error("Error reading file:", error);
    throw error; // Re-throw to handle it upstream if needed
  }
}

const hardhatConfig: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        bytecodeHash: "none",
      },
    },
  },
  networks: {
    oraichain: {
      url: "https://evm.orai.io/",
      chainId: 108160679,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY || "", ...privateKeys]
        : { mnemonic: process.env.MNEMONIC || "" },
    },
    "oraichain-testnet": {
      url: "https://testnet-v2.evm.orai.io/",
      chainId: 4143398064,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY || "", ...privateKeys]
        : { mnemonic: process.env.MNEMONIC || "" },
    },
    testing: {
      url: "http://127.0.0.1:8545",
      chainId: 3481324938,
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY || "", ...privateKeys]
        : {
            mnemonic:
              process.env.MNEMONIC ||
              extractMnemonicFromAccountKeyFile(process.env.ACCOUNT_KEY_FILE || "") ||
              "",
          },
    },
  },
};

export default hardhatConfig;
