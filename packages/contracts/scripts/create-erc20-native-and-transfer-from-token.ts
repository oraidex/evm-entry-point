import hre from "hardhat";
import {
  ExampleERC20Native__factory,
  IBank__factory,
} from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account, secondAccount, ...accs] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const tokenFactoryAddress =
    "orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69";

  const sendTx = await IBank__factory.connect(
    "0x9000000000000000000000000000000000000004",
    account
  ).send(secondAccount.address, "orai", 100000n);
  console.log("Send tx:", sendTx.hash);
  // local: orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69
  // mainnet: orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42
  // console.log(secondAccount);
  const erc20Native = await new ExampleERC20Native__factory(account).deploy(
    tokenFactoryAddress,
    "YASUO",
    "YASUO",
    18,
    1000000n * 10n ** 18n
  );
  console.log("Deploy tx:", await erc20Native.waitForDeployment());
  console.log("ERC20Native address:", erc20Native.target);
  console.log("Name:", await erc20Native.name());
  console.log("Symbol:", await erc20Native.symbol());
  console.log("Total supply:", await erc20Native.totalSupply());
  const fullDenom = await erc20Native.fulldenom();
  console.log("Full denom:", fullDenom);

  // const authz = IAuthz__factory.connect(
  //   "0x9000000000000000000000000000000000000005",
  //   account
  // );
  // const tx = await authz.setGrant(secondAccount.address, fullDenom, 1000n);
  // console.log("Set Grant:", tx.hash);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // const grantAmount = await authz.grant(
  //   account.address,
  //   secondAccount.address,
  //   fullDenom
  // );
  // console.log("Grant:", grantAmount);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // const result = await authz
  //   .connect(secondAccount)
  //   .execGrant(
  //     account.address,
  //     "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1",
  //     fullDenom,
  //     1000n
  //   );
  // console.log("Exec Grant:", result.hash);

  const approveTx = await erc20Native.approve(secondAccount.address, 10000n);
  console.log(`Approve tx: ${approveTx.hash}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const allowance = await erc20Native.allowance(
    account.address,
    secondAccount.address
  );
  console.log("Allowance:", allowance.toString());
  const transferFromTx = await erc20Native
    .connect(secondAccount)
    .transferFrom(
      account.address,
      "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1",
      1000n
    );
  console.log(`Transfer from tx: ${transferFromTx.hash}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const tokenBalance = await erc20Native.balanceOf(
    "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1"
  );
  if (tokenBalance !== 1000n) {
    throw new Error("Failed");
  }
  const afterAllowance = await erc20Native.allowance(
    account.address,
    secondAccount.address
  );
  console.log("After Allowance:", afterAllowance.toString());
};

main();
