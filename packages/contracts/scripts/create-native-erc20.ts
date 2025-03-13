import hre from "hardhat";
import {
  ExampleNativeERC20__factory,
  IBank__factory,
} from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account, ...accs] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const tokenFactoryAddress =
    "orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9";

  const bank = IBank__factory.connect(
    "0x9000000000000000000000000000000000000004",
    account
  );
  await bank.send(ethers.ZeroAddress, "orai", 1n);
  // const supply = await bank.supply(
  //   "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h"
  // );
  // console.log(supply);
  // return;
  // local: orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69
  // mainnet: orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42
  const nativeERC20 = await new ExampleNativeERC20__factory(account).deploy(
    `factory/${tokenFactoryAddress}/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h`,
    "MAX",
    "MAX",
    6
  );
  console.log("Deploy tx:", await nativeERC20.waitForDeployment());
  console.log("ERC20Native address:", nativeERC20.target);
  console.log("Name:", await nativeERC20.name());
  console.log("Symbol:", await nativeERC20.symbol());
  console.log("Total supply:", await nativeERC20.totalSupply());
  console.log("Full denom:", await nativeERC20.fulldenom());
};

main();
