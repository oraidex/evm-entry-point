import { useDebounce } from "@/hooks/useDebounce";
import { Token } from "@/types/Token";
// import { Osor } from "@oraichain/oraidex-evm-sdk";
import { Decimal } from "decimal.js";
import { useEffect, useState } from "react";

interface UseSwapProps {
  tokenList: Token[];
}

// const osor = new Osor("https://osor.oraidex.io/smart-router/alpha-router");

export const useSwap = (props: UseSwapProps) => {
  const { tokenList } = props;

  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);
  const [debounceAmount0, amount0, setAmount0] = useDebounce<
    string | undefined
  >(undefined, 1000);
  const [amount1, setAmount1] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (tokenList.length >= 2) {
      setToken0(tokenList[0]);
      setToken1(tokenList[1]);
    }
  }, [tokenList]);

  useEffect(() => {
    (async () => {
      if (!token0 || !token1) {
        console.log("choose token");
        return;
      }

      const amountIn = new Decimal(debounceAmount0 || 0);

      if (amountIn.isZero()) {
        console.log("Input amount");
        setAmount1("0");
        return;
      }

      // const res = await osor.getSwapOraidexMsg(
      //   {
      //     amount: amountIn.mul(10 ** token0.decimals.cosmos).toString(),
      //     currency: {
      //       address: token0.address.cosmos,
      //       chainId: "Oraichain",
      //       decimals: token0.decimals.cosmos,
      //       symbol: token0.symbol,
      //     },
      //   },
      //   {
      //     address: token1.address.cosmos,
      //     chainId: "Oraichain",
      //     decimals: token1.decimals.cosmos,
      //     symbol: token1.symbol,
      //   }
      // );

      setAmount1("1.23");
    })();
  }, [debounceAmount0, token0, token1]);

  const onAmount0Change = (value: string | undefined) => {
    setAmount0(value);
  };

  return {
    token0,
    token1,
    amount0,
    amount1,
    onAmount0Change,
  };
};
