import { Token } from "@/types/Token";
import { useEffect, useState } from "react";

interface UseSwapProps {
  tokenList: Token[];
}

export const useSwap = (props: UseSwapProps) => {
  const { tokenList } = props;

  const [token1, setToken1] = useState<Token | null>(null);
  const [token2, setToken2] = useState<Token | null>(null);

  useEffect(() => {
    if (tokenList.length >= 2) {
      setToken1(tokenList[0]);
      setToken2(tokenList[1]);
    }
  }, [tokenList]);

  return {
    token1,
    token2,
  };
};
