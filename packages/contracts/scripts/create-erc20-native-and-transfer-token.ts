import hre from "hardhat";
import {
  IWasmd__factory,
  NativeERC20__factory,
  CW20ERC20Token__factory,
  ERC20Native__factory,
  IBank__factory,
  IAddr__factory,
  IAuthz__factory,
} from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account, ...accs] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const tokenFactoryAddress =
    "orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69";

  // local: orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69
  // mainnet: orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42
  const erc20Native = await new ERC20Native__factory(account).deploy(
    tokenFactoryAddress,
    "YASUOS",
    "YASUOS",
    18,
    1000000n * 10n ** 18n
  );
  console.log("Deploy tx:", await erc20Native.waitForDeployment());
  console.log("ERC20Native address:", erc20Native.target);
  console.log("Name:", await erc20Native.name());
  console.log("Symbol:", await erc20Native.symbol());
  console.log("Total supply:", await erc20Native.totalSupply());
  console.log("Full denom:", await erc20Native.fulldenom());
  const transferTx = await erc20Native.transfer(
    "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1",
    200000n * 10n ** 18n
  );
  console.log(`Transfer tx: ${transferTx.hash}`);
  // Wait for actually applying tx
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const tokenBalance = await erc20Native.balanceOf(
    "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1"
  );
  console.log("Token balance:", tokenBalance.toString());
  console.log("Total supply:", (await erc20Native.totalSupply()).toString());
  if (tokenBalance !== 200000n * 10n ** 18n) {
    throw new Error("Failed");
  }
};

main();
