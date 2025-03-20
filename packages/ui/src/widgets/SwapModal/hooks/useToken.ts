import { getTokenList } from "@/apis/get-token-list";
import { useQuery } from "@tanstack/react-query";

export const useToken = (_props: any) => {
  const { status, data: tokenList, error } = useQuery({
    queryKey: ["token"],
    queryFn: getTokenList,
    initialData: [],
  });

  return {
    tokenList,
  };
};
