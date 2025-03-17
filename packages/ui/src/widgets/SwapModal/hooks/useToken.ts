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
