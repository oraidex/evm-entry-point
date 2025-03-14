import { EntryPointTypes } from "@oraichain/osor-api-contracts-sdk/src";
import { ApiClient } from "../ApiClient";
import { OsorSmartRouteResponse } from "../interfaces/IOsor";
import { Currency, CurrencyAmount, TradeType } from "../interfaces/IRouter";
import { SwapOptions } from "../interfaces/IRouter";
import { OsorMsgComposer } from "./OsorMsgComposer";
import { OsorRouter } from "./OsorRouter";
import { Decimal } from 'decimal.js';
import { calculateTimeoutTimestamp, isCw20Token, toBinary } from "../utils";
import { Affiliate } from "@oraichain/osor-api-contracts-sdk/src/EntryPoint.types";
import { IBC_TRANSFER_TIMEOUT } from "../constants";

export class Osor {
    protected readonly apiClient: ApiClient;
    osorRouter: OsorRouter;
    osorMsgComposer: OsorMsgComposer;
    ORAICHAIN_OSOR_ROUTER_ADDRESS = "orai1yglsm0u2x3xmct9kq3lxa654cshaxj9j5d9rw5enemkkkdjgzj7sr3gwt0";


    constructor(
        private readonly osorUrl: string,
    ){ 
        this.apiClient = new ApiClient();
        this.osorRouter = new OsorRouter(this.osorUrl, this.apiClient);
        this.osorMsgComposer = new OsorMsgComposer();
    }

    async getSwapOraidexMsg(
        amount: CurrencyAmount,
        quoteCurrency: Currency,
        swapType: TradeType = TradeType.EXACT_INPUT,
        swapOptions?: SwapOptions,
        slippageTolerance: number = 1,
        affiliates?: Affiliate[],
    ) {
        try {
            const route = await this.osorRouter.route<OsorSmartRouteResponse>(
                amount,
                quoteCurrency,
                swapType,
                swapOptions
            );
            if(!route) {
                throw new Error('No route found');
            }
            const miniumAmount = new Decimal(route.returnAmount).mul(new Decimal(100).sub(slippageTolerance || 0).div(100));
            const msgs = route.routes.map(this.osorMsgComposer.generateMsgFromRouteResponse);

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
                        post_swap_action: {},
                        user_swap: {
                            swap_exact_asset_in: {   
                                swap_venue_name: 'oraidex',  operations: msg
                            }
                        }
                    }
                } as EntryPointTypes.ExecuteMsg;
            })

            if(isCw20Token(amount.currency.address)){
                return executeMsgs.map(msg => {
                    return {
                        send: {
                            contract: this.ORAICHAIN_OSOR_ROUTER_ADDRESS,
                            amount: amount.amount,
                            msg: toBinary(msg)
                          }
                    }
                });
            }

            return executeMsgs;
        } catch (error) {
            throw new Error('Failed to route swap');
        }
    }
}