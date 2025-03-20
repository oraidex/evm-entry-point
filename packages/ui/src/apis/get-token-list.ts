import { Token } from "@/types/Token";
import { OraidexCommon, TokenItemType } from "@oraichain/oraidex-common";

export const getTokenList = async (): Promise<Token[]> => {
    const oraidexCommon = await OraidexCommon.load();
    const evmTokens = oraidexCommon.oraichainEvmTokens as (TokenItemType & {
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
}

function parseDenom(denom: string): string {
    if (denom.startsWith("cw20")) {
        return denom.split(":")[1];
    }

    return denom;
}