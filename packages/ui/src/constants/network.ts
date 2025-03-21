export const MAINNET = {
    id: 108160679,
    name: "Oraichain Mainnet",
    nativeCurrency: {
        name: "Oraichain",
        symbol: "ORAI",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ["https://evm.orai.io"],
        },
    },
    mixedRouter: "orai1cy2pc5czxm5qlacp6j0hfq7qj9wh8zuhxgpdartcfrdljknq0arsuc4znj",
    osorRouter: "orai1r9wq0ehkef0l27tel9qw8hke2fsqktpxg66rnls32xffypf2htrskvrpug",
    multicall: "0xc8D06A27841533886F05F607a11825feaAB2fd7D"
}

export const TESTNET = {
    id: 4143398064,
    name: "Oraichain Testnet",
    nativeCurrency: {
        name: "Oraichain",
        symbol: "ORAI",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ["https://testnet-v2.evm.orai.io"],
        },
    },
    mixedRouter: "orai19d9wrl5g64l63aeqz37s4r7kurejdpwsfl0qm2j6klvtczf4a25s0teeyq",
    osorRouter: "",
    multicall: "0x54E99f99eB33b60dffd7765005b387852980e1c1"
}