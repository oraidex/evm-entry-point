import { getBalances } from "@/apis/get-balances";
import { Token } from "@/types/Token";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { JsonRpcSigner } from "ethers";
import { useMemo } from "react";

type UseBalanceProps = {
  tokenList: Token[];
  signer: JsonRpcSigner | undefined;
};

export const useBalance = (props: UseBalanceProps) => {
  const { tokenList, signer } = props;

  const {
    data: balances,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["balances", tokenList, signer],
    enabled: !!signer,
    queryFn: () =>
      getBalances(
        tokenList.map((token) => token.address.evm),
        signer
      ),
  });

  const formattedBalances = useMemo(() => {
    return tokenList.reduce(
      (acc, token) => {
        acc[token.address.evm] = new Decimal(
          balances?.[token.address.evm]?.toString() || 0
        )
          .div(10 ** token.decimals.evm)
          .toString();

        return acc;
      },
      {} as Record<string, string>
    );
  }, [balances, tokenList]);

  return {
    balances: formattedBalances,
    isLoading,
    refetch,
  };
};
