import hre from "hardhat";
import { A__factory, IBank__factory } from "../typechain-types";
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

  // Deploy ContractA
  console.log("\nDeploying ContractA...");
  const contractA = await new A__factory(deployer).deploy();
  await contractA.waitForDeployment();
  console.log("ContractA deployed to:", contractA.target);

  // Send some initial ORAI to the contract
  console.log("\nSending initial amount to contract...");
  await IBank__factory.connect(
    "0x9000000000000000000000000000000000000004",
    deployer
  ).send(contractA.target, "orai", 1);

  // Wait for the transaction to be processed
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const testTx = await contractA.test(
    "orai1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqtsu49d",
    deployer.address,
    ethers.parseEther("1")
    // {
    //   gasLimit: 50000000,
    //   gasPrice: ethers.parseUnits("0.0001", "gwei"),
    // }
  );
  await testTx.wait();
  console.log("Test transaction hash:", testTx.hash);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
