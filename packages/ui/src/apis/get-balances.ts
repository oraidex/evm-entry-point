import { TESTNET } from "@/constants/network";
import { IERC20__factory, Multicall__factory } from "@oraichain/oraidex-evm-sdk";
import { JsonRpcSigner } from "ethers";

export const getBalances = async (listAddress: string[], signer: JsonRpcSigner): Promise<Record<string, bigint>> => {
    try {
        const balanceRecord: Record<string, bigint> = {};

        console.log('debug balanceRecord :>> ', listAddress, signer);

        const oraiBalance = await signer.provider.getBalance(signer);
        balanceRecord["orai"] = oraiBalance;

        console.log('debug oraiBalance :>> ', oraiBalance);

        const multicall = Multicall__factory.connect(TESTNET.multicall, signer);
        const filteredAddresses = listAddress.filter(address => address !== "orai");

        const chunkSize = 15;
        const chunks = Array.from({ length: Math.ceil(filteredAddresses.length / chunkSize) }, (_, i) =>
            filteredAddresses.slice(i * chunkSize, (i + 1) * chunkSize)
        );

        await Promise.all(
            chunks.map(async (chunk) => {
                const calls = chunk.map(address => ({
                    target: address,
                    callData: IERC20__factory.createInterface().encodeFunctionData('balanceOf', [signer.address])
                }));

                const result = Array.from(await multicall.aggregate.staticCallResult(calls));

                result[1].forEach((r, index) => {
                    const token = chunk[index];
                    const balance = BigInt(r as any);
                    balanceRecord[token] = balance;
                });
            })
        );

        console.log('debug balanceRecord :>> ', balanceRecord);

        return balanceRecord;
    } catch (error) {
        console.error(error);
        return {};
    }
}