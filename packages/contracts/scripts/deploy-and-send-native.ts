import hre from "hardhat";
import { IBank__factory, NativeTokenSender__factory } from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get initial balances
  const deployerBalance = await deployer.provider.getBalance(deployer.address);

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
  console.log("\nSending", amountToSend / 1e6, "ORAI to receiver...");

  // if send amountToSend to contract before, tx will success
  //   await IBank__factory.connect(
  //     "0x9000000000000000000000000000000000000004",
  //     deployer
  //   ).send(nativeTokenSender.target, "orai", amountToSend); // 0.000001 orai
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  const sendTx = await nativeTokenSender.sendNativeTokens(
    deployer.address,
    amountToSend,
    {
      value: amountToSend * 1e12,
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

  // Check balance using contract method
  const contractBalance = await nativeTokenSender.getNativeBalance(
    deployer.address
  );
  console.log(
    "deployer balance from contract:",
    ethers.formatEther(contractBalance),
    "ORAI"
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
