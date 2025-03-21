import { ethers } from "hardhat";

// deployed at 0xc8D06A27841533886F05F607a11825feaAB2fd7D miannet
// deployed at 0x4200000000000000000000000000000000000006 testnet

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying Multicall contract with the account:", deployer.address);

    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    const Multicall = await ethers.getContractFactory("Multicall");
    const multicall = await Multicall.deploy();
    await multicall.waitForDeployment();

    const multicallAddress = await multicall.getAddress();
    console.log("Multicall deployed to:", multicallAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
