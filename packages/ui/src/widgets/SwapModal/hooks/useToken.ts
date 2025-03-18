import { Token } from "@/types/Token";
import { useEffect, useState } from "react";

export const useToken = (_props: any) => {
  // const {} = props;

  const [tokenList, setTokenList] = useState<Token[]>([]);
  useEffect(() => {
    (async () => {
      try {
        // get from API
        const tokenList: Token[] = [
          {
            address: {
              cosmos: "orai",
              evm: "orai",
            },
            name: "Oraichain",
            symbol: "ORAI",
            decimals: {
              cosmos: 6,
              evm: 18,
            },
            image: "https://images.orai.io/logo/orai-token.png",
          },
          {
            address: {
              cosmos: "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh",
              evm: "0xFE7394f22465EB1ae0843acEef270C377CB43567",
            },
            name: "USDT",
            symbol: "USDT",
            decimals: {
              cosmos: 6,
              evm: 6,
            },
            image: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
          },
          {
            address: {
              cosmos: "orai15un8msx3n5zf9ahlxmfeqd2kwa5wm0nrpxer304m9nd5q6qq0g6sku5pdd",
              evm: "0xE99f09A4A4D791fdEb845aA6370e08E8b9DC7966",
            },
            name: "USDC",
            symbol: "USDC",
            decimals: {
              cosmos: 6,
              evm: 6,
            },
            image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
          },
          {
            address: {
              cosmos:
                "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraim8c9d1nkfuQk9EzGYEUGxqL3MHQYndRw1huVo5h",
              evm: "0x519d9D63437e1111c6b84B6796dd500F800805ED",
            },
            name: "Max",
            symbol: "MAX",
            decimals: {
              cosmos: 6,
              evm: 6,
            },
            image:
              "https://pump.mypinata.cloud/ipfs/QmcGwYebsQfYbNSM9QDAMS2wKZ8fZNEiMbezJah1zgEWWS?img-width=256&img-dpr=2",
          },
          {
            address: {
              cosmos:
                "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/orairHM3Yw2PbTfCty1PXy7tEUx3uBMfjouNbm4KnRJ",
              evm: "0xF8b2dE81C69479396fb56820afa176a0415b6C49",
            },
            name: "JPOW",
            symbol: "JPOW",
            decimals: {
              cosmos: 6,
              evm: 6,
            },
            image:
              "https://ipfs.io/ipfs/QmTNx93FdeSwBxsqbZF5NuhVU9AWwodpwqjuHtGEMRTV38",
          },
          {
            address: {
              cosmos:
                "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/D7yP4ycfsRWUGYionGpi64sLF2ddZ2JXxuRAti2M7uck",
              evm: "0x02249E7C7371d78492A04b80937129709cD21609",
            },
            name: "RACKS",
            symbol: "RACKS",
            decimals: {
              cosmos: 6,
              evm: 6,
            },
            image:
              "https://ipfs.io/ipfs/QmVRPsBSHpamDzcDzVL9wsbB9gr4frtNrrFF7g44Xa9FuS",
          },
          {
            address: {
              cosmos:
                "factory/orai1wuvhex9xqs3r539mvc6mtm7n20fcj3qr2m0y9khx6n5vtlngfzes3k0rq9/oraix39mVDGnusyjag97Tz5H8GvGriSZmhVvkvXRoc4",
              evm: "0x2AD16a6d000a338f2e59EA4636d633d7b46a4cc4",
            },
            name: "LEE",
            symbol: "LEE",
            decimals: {
              cosmos: 6,
              evm: 6,
            },
            image:
              "https://ipfs.io/ipfs/QmWh89Xh8bVMD1vP4VLtkazQjM7TyYxfoufMn5SZHuEJY1",
          },
        ];

        setTokenList(tokenList);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return {
    tokenList,
  };
};
