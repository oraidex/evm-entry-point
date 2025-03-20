import { getPrices } from "@/apis/get-prices";
import { useQuery } from "@tanstack/react-query";

export const usePrice = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["prices"],
        queryFn: getPrices,
        initialData: {},
    });

    return {
        data,
        isLoading,
        error,
    };
}