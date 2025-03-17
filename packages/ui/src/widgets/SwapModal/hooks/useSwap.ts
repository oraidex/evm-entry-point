import { useDebounce } from "@/hooks/useDebounce";
import { Token } from "@/types/Token";
import { EntryPointTypes, Osor } from "@oraichain/oraidex-evm-sdk";
import { Decimal } from "decimal.js";
import { useEffect, useMemo, useState } from "react";

interface UseSwapProps {
  tokenList: Token[];
}

const osor = new Osor("https://osor.oraidex.io/smart-router/alpha-router");

export const useSwap = (props: UseSwapProps) => {
  const { tokenList } = props;

  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);
  const [debounceAmountIn, amountIn, setAmountIn] = useDebounce<
    string | undefined
  >(undefined, 1000);
  const [simulateResponse, setSimulateResponse] = useState<{
    executeMsg: (EntryPointTypes.ExecuteMsg | {
      send: {
        contract: string,
        amount: string,
        msg: string
      }
    })[],
    returnAmount: string
  } | null>(null)

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

      const amountIn = new Decimal(debounceAmountIn || 0);

      if (amountIn.isZero()) {
        setSimulateResponse(null);
        return;
      }

      const res = await osor.getSwapOraidexMsg(
        {
          amount: amountIn.mul(10 ** token0.decimals.cosmos).toString(),
          currency: {
            address: token0.address.cosmos,
            chainId: "Oraichain",
            decimals: token0.decimals.cosmos,
            symbol: token0.symbol,
          },
        },
        {
          address: token1.address.cosmos,
          chainId: "Oraichain",
          decimals: token1.decimals.cosmos,
          symbol: token1.symbol,
        }
      );


      setSimulateResponse(res);
    })();
  }, [debounceAmountIn, token0, token1]);

  const amountOut = useMemo(() => {
    if (!simulateResponse) return "0";

    return new Decimal(simulateResponse.returnAmount).div(10 ** token1.decimals.cosmos).toString();
  }, [simulateResponse])

  const onAmount0Change = (value: string | undefined) => {
    // TODO: more validate here
    setAmountIn(value);
  };

  return {
    token0,
    token1,
    amountIn,
    amountOut,
    onAmount0Change,
  };
};
