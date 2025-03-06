import hre from "hardhat";
import { PoolV2Factory__factory } from "../typechain-types";

const { ethers } = hre;

// test 1: 0xbeB7E8F157deBac52e9117F9e9BA377544bDE301

const main = async () => {
    const [account] = await ethers.getSigners();
    console.log("Connect account with address:", account.address);
    const balance = await account.provider.getBalance(account.address);
    console.log("Account balance:", ethers.formatEther(balance));

    // const factory = await new PoolV2Factory__factory(account).deploy('orai167r4ut7avvgpp3rlzksz6vw5spmykluzagvmj3ht845fjschwugqjsqhst');
    // console.log("Deploy tx:", await factory.waitForDeployment());
    // console.log("Factory address:", factory.target);

    
}

main().then(() => {
    console.log("Done.");
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});