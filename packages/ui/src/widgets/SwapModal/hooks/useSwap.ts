import { WASMD_PRECOMPILE_ENTRY } from "@/constants/contract-address";
import { useDebounce } from "@/hooks/useDebounce";
import { Token } from "@/types/Token";
import { EntryPointTypes, IWasmd__factory, Osor, TradeType } from "@oraichain/oraidex-evm-sdk";
import { Buffer } from "buffer";
import { Decimal } from "decimal.js";
import { JsonRpcSigner } from "ethers";
import { useEffect, useMemo, useState } from "react";

interface UseSwapProps {
  tokenList: Token[];
  signer: JsonRpcSigner | undefined;
}

const osor = new Osor("https://osor.oraidex.io/smart-router/alpha-router");

export const useSwap = (props: UseSwapProps) => {
  const { tokenList, signer } = props;

  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);
  const [debounceAmountIn, amountIn, setAmountIn] = useDebounce<
    string | undefined
  >(undefined, 1000);
  const [simulateResponse, setSimulateResponse] = useState<{
    executeMsg: EntryPointTypes.ExecuteMsg | {
      send: {
        contract: string,
        amount: string,
        msg: string
      }
    },
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

      console.log(
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
        },
        // TODO:  query on Mapping module EVM-address
        `orai123wgyr9vfzfn37hh5s7xk2ucyhynex2ulspwj9`,
        TradeType.EXACT_INPUT
      )

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
        },
        // TODO:  query on Mapping module EVM-address
        `orai123wgyr9vfzfn37hh5s7xk2ucyhynex2ulspwj9`,
        TradeType.EXACT_INPUT
      );

      setSimulateResponse({
        executeMsg: res.executeMsg[0],
        returnAmount: res.returnAmount
      });
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

  const handleSwap = async () => {
    console.log("swap");
    const wasmd = IWasmd__factory.connect(WASMD_PRECOMPILE_ENTRY, signer);

    let toContract = osor.ORAICHAIN_OSOR_ROUTER_ADDRESS;
    const coins = [];
    const msg = Buffer.from(JSON.stringify(simulateResponse.executeMsg))

    if ("send" in simulateResponse.executeMsg) {
      toContract = token0.address.cosmos;
    } else {
      const amountIn = new Decimal(debounceAmountIn || 0).mul(10 ** token0.decimals.cosmos).toString();
      coins.push({
        denom: token0.address.cosmos,
        amount: amountIn
      });
    }

    console.log({
      toAddress: toContract,
      msg: simulateResponse.executeMsg,
      coins: coins,
    })

    const res = await wasmd.execute(toContract, msg, Buffer.from(JSON.stringify(coins)));

    console.log(res);
  }

  const handleReverseOrder = () => {
    const [newToken0, newToken1] = [token1, token0];
    setToken0(newToken0);
    setAmountIn(amountOut);
    setToken1(newToken1);
  }

  return {
    token0,
    token1,
    amountIn,
    amountOut,
    setToken0,
    setToken1,
    onAmount0Change,
    handleSwap,
    handleReverseOrder
  };
};
