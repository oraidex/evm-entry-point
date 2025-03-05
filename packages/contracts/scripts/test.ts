import hre from "hardhat";

const { ethers } = hre;

const main = async () => {
    const [account] = await ethers.getSigners();
    console.log("Connect account with address:", account.address);
    const balance = await account.provider.getBalance(account.address);
    console.log("Account balance:", ethers.formatEther(balance));
}

main().then(() => {
    console.log("Done.");
    process.exit(0);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});