import { EntryPointTypes } from "@oraichain/osor-api-contracts-sdk/src";
import { Affiliate } from "@oraichain/osor-api-contracts-sdk/src/EntryPoint.types";
import { Decimal } from 'decimal.js';
import { ApiClient } from "../ApiClient";
import { IBC_TRANSFER_TIMEOUT } from "../constants";
import { OsorSmartRouteResponse } from "../interfaces/IOsor";
import { Currency, CurrencyAmount, SwapOptions, TradeType } from "../interfaces/IRouter";
import { calculateTimeoutTimestamp, isCw20Token, toBinary } from "../utils";
import { OsorMsgComposer } from "./OsorMsgComposer";
import { OsorRouter } from "./OsorRouter";

export class Osor {
    protected readonly apiClient: ApiClient;
    osorRouter: OsorRouter;
    osorMsgComposer: OsorMsgComposer;
    ORAICHAIN_OSOR_ROUTER_ADDRESS = "orai1yglsm0u2x3xmct9kq3lxa654cshaxj9j5d9rw5enemkkkdjgzj7sr3gwt0";

    constructor(
        private readonly osorUrl: string,
    ) {
        this.apiClient = new ApiClient();
        this.osorRouter = new OsorRouter(this.osorUrl, this.apiClient);
        this.osorMsgComposer = new OsorMsgComposer();
    }


    /**
     * Generates swap messages for Oraidex using the OSOR router.
     * 
     * This method creates the necessary messages to perform a token swap on Oraidex.
     * It first finds the optimal route for the swap using the OSOR router, then generates
     * the appropriate messages based on the route response.
     * 
     * @param {CurrencyAmount} amount - The amount of tokens to swap. For EXACT_INPUT swaps, this is the input token amount.
     *                                  For EXACT_OUTPUT swaps, this is the output token amount.
     * @param {Currency} quoteCurrency - The currency to receive after the swap. For EXACT_INPUT swaps, this is the output token.
     *                                   For EXACT_OUTPUT swaps, this is the input token.
     * @param {TradeType} swapType - The type of swap to perform (EXACT_INPUT or EXACT_OUTPUT). Defaults to EXACT_INPUT.
     * @param {SwapOptions} [swapOptions] - Optional configuration for the swap, including protocols to use and maximum number of splits.
     * @param {number} slippageTolerance - The maximum acceptable slippage percentage (0-100). Defaults to 1%.
     * @param {Affiliate[]} [affiliates] - Optional array of affiliate addresses to receive fees from the swap.
     *                                     Each affiliate has an address and basis_points_fee.
     *                                     The basis_points_fee is expressed in basis points, where:
     *                                     - 1 basis point = 0.01% = 0.0001 in decimal form
     *                                     - 100 basis points = 1% = 0.01 in decimal form
     *                                     - Example: { address: "addr", basis_points_fee: "100" } means 1% fee
     * 
     * @returns {Promise<{ executeMsg: (EntryPointTypes.ExecuteMsg | { send: { contract: string, amount: string, msg: string } })[], returnAmount: string }>} - 
     *          An object containing an array of messages to execute the swap and the return amount. If the input token is a CW20 token,
     *          returns an array of CW20 send messages. Otherwise, returns an array of execute messages.
     * 
     * @throws {Error} - Throws an error if no route is found or if the routing process fails.
     */
    async getSwapOraidexMsg(
        amount: CurrencyAmount,
        quoteCurrency: Currency,
        recipient: string,
        swapType: TradeType = TradeType.EXACT_INPUT,
        swapOptions?: SwapOptions,
        slippageTolerance: number = 1,
        affiliates?: Affiliate[],
    ): Promise<{
        executeMsg: (EntryPointTypes.ExecuteMsg | {
            send: {
                contract: string,
                amount: string,
                msg: string
            }
        })[],
        returnAmount: string
    }> {
        try {
            const route = await this.osorRouter.route<OsorSmartRouteResponse>(
                amount,
                quoteCurrency,
                swapType,
                swapOptions
            );
            if (!route) {
                throw new Error('No route found');
            }
            console.log(route);
            const miniumAmount = new Decimal(route.returnAmount).mul(new Decimal(100).sub(slippageTolerance || 0).div(100));
            const msgs = route.routes.map(route => this.osorMsgComposer.generateMsgFromRouteResponse(route));

            const executeMsgs = msgs.map(msg => {
                return {
                    swap_and_action: {
                        affiliates: affiliates || [],
                        min_asset: isCw20Token(quoteCurrency.address) ? {
                            cw20: {
                                address: quoteCurrency.address,
                                amount: miniumAmount.toFixed(0).toString(),
                            }
                        } : {
                            native: {
                                amount: miniumAmount.toFixed(0).toString(),
                                denom: quoteCurrency.address,
                            }
                        },
                        timeout_timestamp: +calculateTimeoutTimestamp(IBC_TRANSFER_TIMEOUT),
                        post_swap_action: {
                            transfer: {
                                to_address: recipient
                            }
                        },
                        user_swap: {
                            swap_exact_asset_in: {
                                swap_venue_name: 'oraidex', operations: msg
                            }
                        }
                    }
                } as EntryPointTypes.ExecuteMsg;
            })

            if (isCw20Token(amount.currency.address)) {
                return {
                    executeMsg: executeMsgs.map(msg => {
                        return {
                            send: {
                                contract: this.ORAICHAIN_OSOR_ROUTER_ADDRESS,
                                amount: amount.amount,
                                msg: toBinary(msg)
                            }
                        }
                    }),
                    returnAmount: route.returnAmount
                }
            }

            return {
                executeMsg: executeMsgs,
                returnAmount: route.returnAmount
            };
        } catch (error) {
            console.log(error);
            throw new Error('Failed to route swap');
        }
    }
}