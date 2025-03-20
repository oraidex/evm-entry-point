import { Token } from "@/types/Token"
import { JsonRpcSigner } from "ethers";

type UseBalanceProps = {
    tokenList: Token[];
    signer: JsonRpcSigner | undefined;
}

export const useBalance = (props: UseBalanceProps) => {
    const { tokenList, signer } = props;
    
}