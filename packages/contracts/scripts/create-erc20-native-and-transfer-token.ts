import hre from "hardhat";
import {
  ExampleERC20Native__factory,
  IAddr__factory,
  IBank__factory,
} from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account, secondAccount, ...accs] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const tokenFactoryAddress = process.env.TOKEN_FACTORY_ADDRESS || "orai1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5ws5thn3e";
  console.log("Token factory address:", tokenFactoryAddress);

  console.log(
    "Cosmos address:",
    await IAddr__factory.connect(
      "0x9000000000000000000000000000000000000003",
      account
    ).getCosmosAddr(account.address)
  );
  const bank = IBank__factory.connect(
    "0x9000000000000000000000000000000000000004",
    account
  );
  const sendTx = await bank.send(secondAccount.address, "orai", 100000n);
  console.log("Send tx:", sendTx.hash);
  // local: orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69
  // testnet: orai1wkwy0xh89ksdgj9hr347dyd2dw7zesmtrue6kfzyml4vdtz6e5ws5thn3e
  // mainnet: orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42
  const erc20Native = await new ExampleERC20Native__factory(account).deploy(
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
  const totalSupply = await erc20Native.totalSupply();
  console.log("Token balance:", tokenBalance.toString());
  console.log("Total supply:", totalSupply.toString());
  const fulldenom = await erc20Native.fulldenom();
  if (tokenBalance !== 200000n * 10n ** 18n) {
    throw new Error("Failed");
  }

  const mintTx = await erc20Native.mint(
    secondAccount.address,
    100000n * 10n ** 18n
  );
  console.log(`Mint tx: ${mintTx.hash}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (
    totalSupply + 100000n * 10n ** 18n !==
    (await erc20Native.totalSupply())
  ) {
    throw new Error("Failed");
  }

  const burnTx = await erc20Native
    .connect(secondAccount)
    .burn(50000n * 10n ** 18n);
  console.log(`Burn tx: ${burnTx.hash}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const approveFirstAccTx = await erc20Native
    .connect(secondAccount)
    .approve(account.address, 50000n * 10n ** 18n);
  console.log(`Approve tx: ${approveFirstAccTx.hash}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const burnFromTx = await erc20Native
    .connect(account)
    .burnFrom(secondAccount.address, 50000n * 10n ** 18n);
  console.log(`Burn from tx: ${burnFromTx.hash}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const receiverBalance = await erc20Native.balanceOf(secondAccount.address);
  if (receiverBalance !== 0n * 10n ** 18n) {
    throw new Error("Failed");
  }
};
main();
