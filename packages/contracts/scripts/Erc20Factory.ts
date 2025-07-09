import { ethers } from "hardhat";

import { IERC20Factory__factory, IERC20__factory } from "../typechain-types";

async function main() {
  // get signer
  const [signer] = await ethers.getSigners();
  console.log("signer: ", signer.address);
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("balance: ", ethers.formatEther(balance));

  const precompile = IERC20Factory__factory.connect(
    "0x0000000000000000000000000000000000000900",
    signer
  );

  // try to create asset
  const tx = await precompile.create(
    0, // token type
    new Uint8Array([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    ]), // salt
    "TEST TOKEN", // name
    "TST", // symbol
    18 // decimals
  );
  await tx.wait();
  console.log("tx: ", tx.hash);

  // get erc20 contracts
  const contractAddress = await precompile.getAddress();
  console.log("erc20Contracts: ", contractAddress);

  // try to get asset
  let asset = await precompile.getAsset(contractAddress);
  console.log("asset: ", asset);

  // try to get all assets
  const assets = await precompile.getAllAssets();
  console.log("assets: ", assets);

  // try to mint token
  let mintTx = await precompile.mint(
    contractAddress,
    signer.address,
    ethers.parseEther("1000")
  );
  await mintTx.wait();
  console.log("mintTx: ", mintTx.hash);

  // try to burn token
  const burnTx = await precompile.burn(
    contractAddress,
    signer.address,
    ethers.parseEther("100")
  );
  await burnTx.wait();
  console.log("burnTx: ", burnTx.hash);

  // try to pause token
  const pauseTx = await precompile.pause(contractAddress);
  await pauseTx.wait();
  console.log("pauseTx: ", pauseTx.hash);

  // try to mint but get error
  try {
    const mintTx = await precompile.mint(
      contractAddress,
      signer.address,
      ethers.parseEther("1000")
    );
    await mintTx.wait();
    console.log("mintTx: ", mintTx.hash);
  } catch (error) {
    console.log("get error: ", error);
  }

  // try to unpause token
  const unpauseTx = await precompile.unpause(contractAddress);
  await unpauseTx.wait();
  console.log("unpauseTx: ", unpauseTx.hash);

  // try to mint token after unpause
  mintTx = await precompile.mint(
    contractAddress,
    signer.address,
    ethers.parseEther("1000")
  );
  await mintTx.wait();
  console.log("mintTx: ", mintTx.hash);

  // try to add whitelist address
  const addWhitelistTx = await precompile.updateWhitelistedAddresses(
    contractAddress,
    [signer.address]
  );
  await addWhitelistTx.wait();
  console.log("addWhitelistTx: ", addWhitelistTx.hash);

  // try to get asset
  asset = await precompile.getAsset(contractAddress);
  console.log("asset: ", asset);

  // try to remove whitelist address
  const removeWhitelistTx = await precompile.updateWhitelistedAddresses(
    contractAddress,
    []
  );
  await removeWhitelistTx.wait();
  console.log("removeWhitelistTx: ", removeWhitelistTx.hash);

  // try to get asset
  asset = await precompile.getAsset(contractAddress);
  console.log("asset: ", asset);

  // try to update owner
  const updateOwnerTx = await precompile.updateOwner(
    contractAddress,
    "0xdBE9194d8A84f79002A351109cA0c8C0acc790B5"
  );
  await updateOwnerTx.wait();
  console.log("update owner tx: ", updateOwnerTx.hash);

  // try to get asset
  asset = await precompile.getAsset(contractAddress);
  console.log("asset: ", asset);

  // get erc20 interface
  const erc20 = IERC20__factory.connect(contractAddress, signer);
  const transferTx = await erc20.transfer(
    "0xdBE9194d8A84f79002A351109cA0c8C0acc790B5",
    ethers.parseEther("100")
  );
  await transferTx.wait();
  console.log("transferTx: ", transferTx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
