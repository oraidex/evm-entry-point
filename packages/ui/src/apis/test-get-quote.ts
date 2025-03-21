import { WASMD_PRECOMPILE_ENTRY } from "@/constants";
import { IWasmd__factory } from "@oraichain/oraidex-evm-sdk";
import { ethers } from "ethers";

const testnet = "https://testnet-v2.rpc.orai.io";
const mainnet = "https://evm.orai.io";

export const testGetQuote = async (offerAmount: string, offerAsset: string, askAsset: string) => {
    try {
        const queryClient = new ethers.JsonRpcProvider(mainnet);

        const wasmd = IWasmd__factory.connect(WASMD_PRECOMPILE_ENTRY, queryClient);

        const res = await wasmd.query("orai1r9wq0ehkef0l27tel9qw8hke2fsqktpxg66rnls32xffypf2htrskvrpug", Buffer.from(JSON.stringify({
            simulate_swap_operations: {
                offer_amount: offerAmount,
                operations: [
                    {
                        orai_swap: {
                            offer_asset_info: {
                                native_token: {
                                    denom: offerAsset
                                }
                            },
                            ask_asset_info: {
                                native_token: {
                                    denom: askAsset
                                }
                            }
                        }
                    }
                ]
            }
        })));

        return {
            returnAmount: JSON.parse(
                Buffer.from(res.slice(2), "hex").toString("utf-8")
            ).amount as string,
            message: {
                execute_swap_operations: {
                    operations: [{
                        orai_swap: {
                            ask_asset_info: {
                                native_token: {
                                    denom: askAsset
                                }
                            },
                            offer_asset_info: {
                                native_token: {
                                    denom: offerAsset
                                }
                            },
                        },
                    }]
                }
            }
        };
    } catch (error) {
        console.error(error);
        return {
            returnAmount: "0",
            message: {
                execute_swap_operations: {
                    operations: []
                }
            }
        };
    }
}