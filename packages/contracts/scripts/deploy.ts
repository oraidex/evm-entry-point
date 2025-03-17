// scripts/deploy.js
import { ethers } from "hardhat";
import { IBank__factory, IWasmd__factory } from "../typechain-types";
import { denomToAssetInfo } from "./helpers";
import { OraiswapPairTypes, OraiswapSmartrouterClient
} from "@oraichain/oraidex-contracts-sdk";
import { coins } from "@cosmjs/stargate";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // const balance = await deployer.getBalance();
  // console.log("Account balance:", balance.toString());

  const wasmd = IWasmd__factory.connect("0x9000000000000000000000000000000000000001", deployer);
  // const bank = IBank__factory.connect("0x9000000000000000000000000000000000000004", deployer);
  // const tx  = await bank.supply('factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraix39mVDGnusyjag97Tz5H8GvGriSZmhVvkvXRoc4');
  // console.log(tx);


  const req = Buffer.from(JSON.stringify({
    pair: {
        asset_infos: [
        denomToAssetInfo("orai"), 
        denomToAssetInfo("factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h")
      ]
    }
  }));

  const response = await wasmd.query("orai167r4ut7avvgpp3rlzksz6vw5spmykluzagvmj3ht845fjschwugqjsqhst", req);
  const pairResponseFactory = JSON.parse(Buffer.from(response.slice(2), 'hex').toString('utf-8')) as any;
  const pair = pairResponseFactory?.contract_addr;

  const msgSwap = {
    swap: {
      offer_asset: {
        info: denomToAssetInfo("factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h"),
        amount: "10000"
      }
    }
  } as OraiswapPairTypes.ExecuteMsg;

  const reqSwap = Buffer.from(JSON.stringify(msgSwap));
  const funds = coins("10000", 'factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h');
  const respSwap = await wasmd.execute(
    pair,
    reqSwap,
    Buffer.from(JSON.stringify(funds)),
  )
  console.log(respSwap);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
