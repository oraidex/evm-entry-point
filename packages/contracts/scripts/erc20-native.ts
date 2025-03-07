import hre from "hardhat";
import {
  IWasmd__factory,
  NativeERC20__factory,
  CW20ERC20Token__factory,
  ERC20Native__factory,
  IBank__factory,
} from "../typechain-types";
const { ethers } = hre;

const main = async () => {
  const [account] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));

  // const erc20Native = await new ERC20Native__factory(account).deploy(
  //   "orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42",
  //   "YASUO",
  //   "YASUO",
  //   18,
  //   1000000n * 10n ** 18n
  // );
  // console.log("Deploy tx:", await erc20Native.waitForDeployment());
  // console.log("ERC20Native address:", erc20Native.target);
  // console.log("Full denom:", await erc20Native.fulldenom());

  // const tx = await erc20Native.transfer(
  //   "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1",
  //   1000n
  // );
  // console.log(`Transfer tx: ${tx.hash}`);

  const result = await IBank__factory.connect(
    "0x9000000000000000000000000000000000000004",
    account
  ).send(
    "0xFEBCB5CE1b111C4f4AC1e52EC81E1F84132Dd2f1",
    "factory/orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42/0x69eab7ed31b8c3dfbc25b622b6834e048f007a44",
    1000n
  );
  console.log(`Transaction hash: ${result.hash}`);

  // const cw20Erc20 = await new CW20ERC20Token__factory(account).deploy(
  //   "orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd",
  //   account,
  //   {
  //     gasPrice: 1n,
  //   }
  // );
  // console.log("Deploy tx:", await cw20Erc20.waitForDeployment());
  // console.log("CW20ERC20 address:", cw20Erc20.target);

  // const wasm = IWasmd__factory.connect(
  //   "0x9000000000000000000000000000000000000001",
  //   account
  // );
  // const tx = await wasm.execute(
  //   "orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42",
  //   Buffer.from(
  //     JSON.stringify({
  //       create_denom: {
  //         metadata: {
  //           name: "TESTT",
  //           symbol: "TESTT",
  //           display: "erc20.TESTT",
  //           base: "factory/orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42/0xb95e42e88b8c4978ed591206e2ebd4db60adaa12",
  //           denom_units: [
  //             {
  //               denom:
  //                 "factory/orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42/0xb95e42e88b8c4978ed591206e2ebd4db60adaa12",
  //               exponent: 0,
  //               aliases: [],
  //             },
  //             { denom: "erc20.TESTT", exponent: 18, aliases: [] },
  //           ],
  //         },
  //         subdenom: "0xb95e42e88b8c4978ed591206e2ebd4db60adaa12",
  //       },
  //     })
  //   ),
  //   Buffer.from(
  //     JSON.stringify([
  //       {
  //         denom: "orai",
  //         amount: 1,
  //       },
  //     ])
  //   )
  // );
  // console.log(tx);

  // const wasm = IWasmd__factory.connect(
  //   "0x9000000000000000000000000000000000000001",
  //   account
  // );
  // const tx = await wasm.execute(
  //   "orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42",
  //   Buffer.from(
  //     JSON.stringify({
  //       create_denom: {
  //         metadata: {
  //           name: "TESTT",
  //           symbol: "TESTT",
  //           display: "uTESTT",
  //           base: "factory/orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42/testt2",
  //           denom_units: [
  //             {
  //               denom:
  //                 "factory/orai17hyr3eg92fv34fdnkend48scu32hn26gqxw3hnwkfy904lk9r09qqzty42/testt2",
  //               exponent: 0,
  //               aliases: [],
  //             },
  //             {
  //               denom: "uTESTT",
  //               exponent: 18,
  //               aliases: [],
  //             },
  //           ],
  //         },
  //         subdenom: "testt2",
  //       },
  //     })
  //   ),
  //   Buffer.from(
  //     JSON.stringify([
  //       {
  //         denom: "orai",
  //         amount: 1,
  //       },
  //     ])
  //   )
  // );
  // console.log(tx);
  // const data = await wasm.query(
  //   "orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9",
  //   Buffer.from(
  //     JSON.stringify({
  //       get_metadata: {
  //         denom:
  //           "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraix39mVDGnusyjag97Tz5H8GvGriSZmhVvkvXRoc4",
  //       },
  //     })
  //   )
  // );
  // console.log(data);

  // const bank = IBank__factory.connect(
  //   "0x9000000000000000000000000000000000000004",
  //   account
  // );
  // const totalSupply = await bank.supply(
  //   "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraix39mVDGnusyjag97Tz5H8GvGriSZmhVvkvXRoc4"
  // );
  // console.log({
  //   totalSupply,
  // });

  // const nativeERC20 = await new NativeERC20__factory(account).deploy(
  //   "orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9",
  //   "oraix39mVDGnusyjag97Tz5H8GvGriSZmhVvkvXRoc4",
  //   6
  // );
  // console.log("Deploy tx:", await nativeERC20.waitForDeployment());
  // console.log("Native ERC20 address:", nativeERC20.target);
  // console.log(`Full denom: ${await nativeERC20.fullDenom()}`);
  // console.log(`Name: ${await nativeERC20.name()}`);
};

main();
