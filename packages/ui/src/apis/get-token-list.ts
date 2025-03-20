import { ORAICHAIN_COMMON_ENDPOINT } from "@/constants/http-endpoint";
import { Token } from "@/types/Token";
import { OraiCommon, TokenItemType } from "@oraichain/common";

export const getTokenList = async (): Promise<Token[]> => {
    try {
        const oraiCommon = await OraiCommon.initializeFromBackend(ORAICHAIN_COMMON_ENDPOINT, "oraidex");
        const oraichainTokens = oraiCommon.tokenItems.oraichainTokens;
        console.log(oraichainTokens.filter((token: any) => token.evmExtendInfo));
        const evmTokens = oraichainTokens.filter((token: any) => token.evmExtendInfo).map((token: any) => {
            const evmExtendInfo = token.evmExtendInfo;
            return {
                ...token,
                evmExtendInfo: {
                    address: evmExtendInfo.address,
                    decimals: evmExtendInfo.decimals,
                },
            };
        }) as (TokenItemType & {
            evmExtendInfo: {
                address: string;
                decimals: number;
            }
        })[];
        const tokenList = evmTokens.map((token) => ({
            address: {
                cosmos: parseDenom(token.denom),
                evm: token.evmExtendInfo.address,
            },
            name: token.name,
            symbol: token.name.toLocaleUpperCase(),
            decimals: {
                cosmos: token.decimals,
                evm: token.evmExtendInfo.decimals,
            },
            image: token.icon,
        }));
        return tokenList;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function parseDenom(denom: string): string {
    if (denom.startsWith("cw20")) {
        return denom.split(":")[1];
    }

    return denom;
}