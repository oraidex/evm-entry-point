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
  const tokenFactoryAddress =
    "orai1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6slh3t69";
  const wasmd = IWasmd__factory.connect(
    "0x9000000000000000000000000000000000000001",
    account
  );
  const tx = await wasmd.execute(
    tokenFactoryAddress,
    Buffer.from(
      JSON.stringify({
        create_denom: {
          metadata: {
            name: "YASUOS",
            symbol: "YASUOS",
            display: "erc20.YASUOS",
            base: `factory/${tokenFactoryAddress}/0xdc6aba2cf9436344982782dc028b3885968cc55b`,
            denom_units: [
              {
                denom: `factory/${tokenFactoryAddress}/0xdc6aba2cf9436344982782dc028b3885968cc55b`,
                exponent: 0,
                aliases: [],
              },
              { denom: "erc20.YASUOS", exponent: 18, aliases: [] },
            ],
          },
          subdenom: "0xdc6aba2cf9436344982782dc028b3885968cc55b",
        },
      })
    ),
    Buffer.from(
      JSON.stringify([
        {
          denom: "orai",
          amount: "1",
        },
      ])
    )
  );
  console.log("Create denom tx:", tx.hash);
};

main();
