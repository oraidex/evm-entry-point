import { oraidexApi } from "./axios";

export const getPrices = async (): Promise<Record<string, number>> => {
    try {
        const response = await oraidexApi.get("/prices/pool-tokens");
        return response.data;
    } catch (error) {
        console.error(error);
        return {};
    }
}