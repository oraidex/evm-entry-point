import hre from "hardhat";
import {
  CW20ERC20Token__factory,
  ExampleNativeERC20__factory,
  IBank__factory,
} from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const cw20Address = process.env.CW20_ADDRESS || "orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd";

  // const supply = await bank.supply(
  //   "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h"
  // );
  // console.log(supply);
  // return;
  // local: orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69
  // mainnet: orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42
  const cw20ERC20 = await new CW20ERC20Token__factory(account).deploy(
    cw20Address,
    account,
  );
  console.log("Deploy tx:", await cw20ERC20.waitForDeployment());
  console.log("ERC20cw20 address:", cw20ERC20.target);
  console.log("Name:", await cw20ERC20.name());
  console.log("Symbol:", await cw20ERC20.symbol());
  console.log("Total supply:", await cw20ERC20.totalSupply());
};

main();
