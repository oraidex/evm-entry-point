import hre from "hardhat";
import { ExampleTokenDeployer__factory } from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account, ...accs] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const tokenFactoryAddress =
    "orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42";

  const TokenDeployerFactory = await hre.ethers.getContractFactory(
    "ExampleTokenDeployer"
  );
  //@ts-ignore
  const tokenDeployer = await upgrades.deployProxy(TokenDeployerFactory, [], {
    kind: "uups",
  });

  const createTokenTx = await tokenDeployer.createToken(
    tokenFactoryAddress,
    "M",
    "M",
    6,
    1000000n * 10n ** 18n,
    {
      value: "1",
    }
  );
  console.log("Create token tx:", await createTokenTx.wait());

  const tokenAddress = await tokenDeployer.tokenDeployer(account.address);
  console.log("Token address:", tokenAddress);
};

main();
