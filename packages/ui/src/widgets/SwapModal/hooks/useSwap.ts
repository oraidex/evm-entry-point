import { testGetQuote } from "@/apis/test-get-quote";
import { WASMD_PRECOMPILE_ENTRY } from "@/constants/contract-address";
import { OSOR_ENDPOINT } from "@/constants/http-endpoint";
import { TESTNET } from "@/constants/network";
import { useDebounce } from "@/hooks/useDebounce";
import { Token } from "@/types/Token";
import {
  EntryPointTypes,
  IWasmd__factory,
  Osor,
} from "@oraichain/oraidex-evm-sdk";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { Decimal } from "decimal.js";
import { JsonRpcSigner } from "ethers";
import { useEffect, useMemo, useState } from "react";

interface UseSwapProps {
  tokenList: Token[];
  signer: JsonRpcSigner | undefined;
  refetchBalances: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Record<string, bigint>, Error>>;
  defaultTokenFrom?: Token;
  defaultTokenTo?: Token;
  onSuccess?: () => void;
  onError?: () => void;
}

const osor = new Osor(OSOR_ENDPOINT);

export const useSwap = (props: UseSwapProps) => {
  const {
    tokenList,
    signer,
    refetchBalances,
    defaultTokenFrom,
    defaultTokenTo,
    onSuccess,
    onError,
  } = props;

  const [isSwapping, setIsSwapping] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [token0, setToken0] = useState<Token | null>(defaultTokenFrom || null);
  const [token1, setToken1] = useState<Token | null>(defaultTokenTo || null);
  const [debounceAmountIn, amountIn, setAmountIn] = useDebounce<
    string | undefined
  >(undefined, 1000);
  const [simulateResponse, setSimulateResponse] = useState<{
    executeMsg:
    | EntryPointTypes.ExecuteMsg
    | {
      send: {
        contract: string;
        amount: string;
        msg: string;
      };
    }
    | {
      execute_swap_operations: {
        operations: {
          orai_swap: {
            ask_asset_info: {
              native_token: {
                denom: string;
              };
            };
            offer_asset_info: {
              native_token: {
                denom: string;
              };
            };
          };
        }[];
      };
    };
    returnAmount: string;
  } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  useEffect(() => {
    if (tokenList.length >= 2) {
      setToken0(tokenList[0]);
      setToken1(tokenList[1]);
    }
  }, [tokenList]);

  useEffect(() => {
    (async () => {
      try {
        if (!token0 || !token1) {
          console.log("choose token");
          return;
        }

        if (refreshTrigger) {
          await refetchBalances();
        }

        const amountIn = new Decimal(debounceAmountIn || 0);

        setIsSimulating(true);
        if (amountIn.isZero()) {
          setSimulateResponse(null);
          return;
        }

        // for testing
        const res = await testGetQuote(
          amountIn.mul(10 ** token0.decimals.cosmos).toString(),
          token0.address.cosmos,
          token1.address.cosmos
        );

        setSimulateResponse({
          executeMsg: res.message,
          returnAmount: res.returnAmount,
        });
      } catch (error) {
        console.log("error simulate", error);
      } finally {
        setIsSimulating(false);
      }
    })();
  }, [debounceAmountIn, token0, token1, refreshTrigger]);

  const amountOut = useMemo(() => {
    if (!simulateResponse) return "0";

    return new Decimal(simulateResponse.returnAmount)
      .div(10 ** token1.decimals.cosmos)
      .toFixed(6);
  }, [simulateResponse]);

  const onAmount0Change = (value: string | undefined) => {
    // TODO: more validate here
    setAmountIn(value);
  };

  const handleSwap = async () => {
    try {
      setIsSwapping(true);
      const wasmd = IWasmd__factory.connect(WASMD_PRECOMPILE_ENTRY, signer);

      // let toContract = osor.ORAICHAIN_OSOR_ROUTER_ADDRESS;
      let toContract = TESTNET.mixedRouter;
      const coins = [];
      const msg = Buffer.from(JSON.stringify(simulateResponse.executeMsg));

      if ("send" in simulateResponse.executeMsg) {
        toContract = token0.address.cosmos;
      } else {
        const amountIn = new Decimal(debounceAmountIn || 0)
          .mul(10 ** token0.decimals.cosmos)
          .toFixed(0);
        coins.push({
          denom: token0.address.cosmos,
          amount: amountIn,
        });
      }

      console.log({
        toAddress: toContract,
        msg: simulateResponse.executeMsg,
        coins: coins,
      });

      const res = await wasmd.execute(
        toContract,
        msg,
        Buffer.from(JSON.stringify(coins))
      );

      const tx = await res.wait(1);

      console.log("debug tx :>> ", tx.hash);

      await refetchBalances();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("error swap", error);
      if (onError) {
        onError();
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const handleReverseOrder = () => {
    const [newToken0, newToken1] = [token1, token0];
    setToken0(newToken0);
    setAmountIn(amountOut);
    setToken1(newToken1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (token0 && token1 && amountIn && !amountIn.match(/^0+$/)) {
        setRefreshTrigger((prev) => prev + 1);
        setIsAutoRefreshing(true);

        setTimeout(() => {
          setIsAutoRefreshing(false);
        }, 1000);
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [token0, token1, amountIn]);

  const refreshSimulation = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsAutoRefreshing(true);

    setTimeout(() => {
      setIsAutoRefreshing(false);
    }, 1000);
  };

  return {
    token0,
    token1,
    amountIn,
    amountOut,
    setToken0,
    setToken1,
    onAmount0Change,
    handleSwap,
    handleReverseOrder,
    refreshSimulation,
    isAutoRefreshing,
    isSimulating,
    isSwapping,
  };
};
