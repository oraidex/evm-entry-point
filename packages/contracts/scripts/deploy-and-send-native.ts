import hre from "hardhat";
import { NativeTokenSender__factory } from "../typechain-types";
import assert from "assert";
const { ethers } = hre;

const main = async () => {
  // Get signers
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // Get initial balances
    const deployerBalance = await deployer.provider.getBalance(
      deployer.address
    );

    console.log(
      "Deployer initial balance:",
      ethers.formatEther(deployerBalance),
      "ORAI"
    );

    // Deploy NativeTokenSender contract
    console.log("\nDeploying NativeTokenSender...");
    const nativeTokenSender = await new NativeTokenSender__factory(
      deployer
    ).deploy();
    await nativeTokenSender.waitForDeployment();
    console.log("NativeTokenSender deployed to:", nativeTokenSender.target);

    // Send native tokens
    const amountToSend = 100; // 0.0001 ORAI
    const weiAmountToSend = amountToSend * 1e12;
    console.log("\nSending", amountToSend / 1e6, "ORAI to receiver...");

    // if send amountToSend to contract before, tx will success

    const sendTx = await nativeTokenSender.sendNativeTokens(
      deployer.address,
      amountToSend,
      {
        value: weiAmountToSend,
      }
    );
    await sendTx.wait();
    console.log("Transaction hash:", sendTx.hash);

    // Get final balances
    const finalDeployerBalance = await deployer.provider.getBalance(
      deployer.address
    );

    console.log("\nFinal balances:");
    console.log(
      "Deployer final balance:",
      ethers.formatEther(finalDeployerBalance),
      "ORAI"
    );

    const weiToSendNumber = +weiAmountToSend.toString();
    const expectedBalanceAfterWithoutGasFees =
      +deployerBalance.toString() - weiToSendNumber;

    // just a rough estimate of the gas fees
    const minExepectedBalanceAfterWithGasFees =
      expectedBalanceAfterWithoutGasFees -
      weiAmountToSend -
      weiAmountToSend / 100000000;
    assert(
      +finalDeployerBalance.toString() <= expectedBalanceAfterWithoutGasFees
    );
    assert(
      +finalDeployerBalance.toString() >= minExepectedBalanceAfterWithGasFees
    );

    // Check balance using contract method
    const contractBalance = await nativeTokenSender.getNativeBalance(
      deployer.address
    );
    console.log(
      "deployer balance from contract:",
      ethers.formatEther(contractBalance),
      "ORAI"
    );
  } catch (error) {
    console.error("Error deploying and sending native tokens:", error);
    process.exit(1);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
