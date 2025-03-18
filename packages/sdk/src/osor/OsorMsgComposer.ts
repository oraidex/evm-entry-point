import { SwapOperation } from '@oraichain/osor-api-contracts-sdk/src';
import { ActionRoute, RouteResponse, SwapActionRoute } from "../interfaces/IRouter";
import { SwapV2, SwapV3 } from "../interfaces/ISwapMessage";
import { denomToAssetInfo, isCw20Token, parsePoolKey, toBinary } from "../utils";


const CONVERTER_CONTRACT = "orai14wy8xndhnvjmx6zl2866xqvs7fqwv2arhhrqq9";


export class OsorMsgComposer {
    constructor() {}

    parseConverterMsgToPoolId = (tokenIn: string, tokenOut: string) => {
        // In Oraichain, conversion from native token to CW20 token always occurs
        // TODO: Query the converter contract to determine the appropriate conversion method
        if (isCw20Token(tokenIn)) {
          // Convert in reverse
          return toBinary({
            contract: CONVERTER_CONTRACT,
            msg: toBinary({
              convert_reverse: {
                from: {
                  native_token: {
                    denom: tokenOut
                  }
                }
              }
            })
          });
        } else {
          // Convert normally
          return toBinary({
            contract: CONVERTER_CONTRACT,
            msg: toBinary({
              convert: {}
            })
          });
        }
      };

    generateMsgFromRouteResponse = (routeResponse: RouteResponse) => {
      const isUniversalMsg = routeResponse.paths.some(path => path.actions.some(action => action.type === 'Bridge'));
        if(isUniversalMsg){
            return this._generateUniversalSwapMsg(routeResponse);
        } else {
            const swapActionRouteSample = routeResponse.paths[0].actions;
            console.log(swapActionRouteSample);
            return this.generateSwapOps(swapActionRouteSample);
        }
    }

    generateSwapOps = (swapActionRoute: ActionRoute[]): SwapOperation[] => {
        const swapOps: SwapOperation[] = [];
        for(const actionRoute of swapActionRoute){
            let tokenIn = actionRoute.tokenIn;
            if(actionRoute.type === 'Bridge'){
                continue;
            }
            for(const path of actionRoute.swapInfo){
                switch(actionRoute.type){
                    case 'Swap': {
                        swapOps.push({
                        denom_in: tokenIn,
                        denom_out: actionRoute.tokenOut,
                        pool: path.poolId,
                    });
                    tokenIn = path.tokenOut;
                    break;
                }
                case 'Convert': 
                 swapOps.push({
                    denom_in: actionRoute.tokenIn,
                    denom_out: actionRoute.tokenOut,
                    pool: this.parseConverterMsgToPoolId(actionRoute.tokenIn, actionRoute.tokenOut)
                  });
                  break;
            }
        }
        }
    return swapOps;
    }

    generateOraidexV2SwapMsg(swapActionRoute: SwapActionRoute): SwapV2[] {
        let tokenIn = swapActionRoute.tokenIn;
        const swapInfo = swapActionRoute.swapInfo;
        const swapMsgs: SwapV2[] = [];
        for(const info of swapInfo){
            const swapMsg:SwapV2 = {
                offer_asset_info: denomToAssetInfo(tokenIn),
                ask_asset_info: denomToAssetInfo(info.tokenOut),
            }
            swapMsgs.push(swapMsg);
            tokenIn = info.tokenOut;
        }
        return swapMsgs;
    }

    generateOraidexV3SwapMsg = (swapActionRoute: SwapActionRoute): SwapV3[] => {
        let tokenIn = swapActionRoute.tokenIn;
        const swapInfo = swapActionRoute.swapInfo;
        const swapMsgs: SwapV3[] = [];
        for(const info of swapInfo){
            const poolKey = parsePoolKey(info.poolId);
            const isXToY = tokenIn === poolKey.token_x;
            const swapMsg:SwapV3 = {
                pool_key: poolKey,
                x_to_y: isXToY,
            }
            swapMsgs.push(swapMsg);
            tokenIn = isXToY ? poolKey.token_y : poolKey.token_x;
        }
        return swapMsgs;
    }

    _generateUniversalSwapMsg = (_routeResponse: RouteResponse): SwapOperation[] => {
        throw new Error('Universal swap have not supported yet');
    }
}