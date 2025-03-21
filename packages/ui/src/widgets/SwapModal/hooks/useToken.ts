import { getTokenList } from "@/apis/get-token-list";
import { Token } from "@/types/Token";
import { useQuery } from "@tanstack/react-query";

type UseTokenProps = {
  defaultTokenFrom?: Token;
  defaultTokenTo?: Token;
  disableTokenSelectFrom?: boolean;
  disableTokenSelectTo?: boolean;
};

export const useToken = (props: UseTokenProps) => {
  const { defaultTokenFrom, defaultTokenTo, disableTokenSelectFrom, disableTokenSelectTo } = props;

  return useQuery({
    queryKey: ["token"],
    queryFn: getTokenList,
    initialData: [defaultTokenFrom, defaultTokenTo].filter(Boolean),
    enabled: !disableTokenSelectFrom && !disableTokenSelectTo,
  });
};
