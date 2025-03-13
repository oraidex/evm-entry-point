import hre from "hardhat";
const { ethers } = hre;

const main = async () => {
  const [account, ...accs] = await ethers.getSigners();
  console.log("Connect account with address:", account.address);
  const balance = await account.provider.getBalance(account.address);
  console.log("Account balance:", ethers.formatEther(balance));
  const tokenFactoryAddress =
    "orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9";

  const ExampleNativeERC20Upgradeable = await hre.ethers.getContractFactory(
    "ExampleNativeERC20Upgradeable"
  );
  //@ts-ignore
  const nativeERC20 = await upgrades.deployProxy(
    ExampleNativeERC20Upgradeable,
    [
      `factory/${tokenFactoryAddress}/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h`,
      "MAX",
      "MAX",
      6,
    ],
    {
      kind: "uups",
    }
  );
  console.log("Deploy tx:", await nativeERC20.waitForDeployment());
  console.log("ERC20Native address:", nativeERC20.target);
  console.log("Name:", await nativeERC20.name());
  console.log("Symbol:", await nativeERC20.symbol());
  console.log("Total supply:", await nativeERC20.totalSupply());
  console.log("Full denom:", await nativeERC20.fulldenom());
};

main();
