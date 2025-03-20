import { ethers } from "hardhat";
import { IERC20__factory, Multicall__factory } from "../typechain-types";

interface IERC20 {
    balanceOf(account: string): Promise<bigint>;
}

async function main() {
    const [deployer] = await ethers.getSigners();

    // Multicall contract address
    const MULTICALL_ADDRESS = "0xc8D06A27841533886F05F607a11825feaAB2fd7D";

    // List of ERC20 token addresses to query
    const TOKEN_ADDRESSES = [
        "0xFE7394f22465EB1ae0843acEef270C377CB43567", // Replace with actual token addresses
        "0xE99f09A4A4D791fdEb845aA6370e08E8b9DC7966",
        "0x519d9D63437e1111c6b84B6796dd500F800805ED",
        "0x02249E7C7371d78492A04b80937129709cD21609",
        "0x2AD16a6d000a338f2e59EA4636d633d7b46a4cc4",
        "0xF8b2dE81C69479396fb56820afa176a0415b6C49"
    ];

    // Address to check balances for
    const OWNER_ADDRESS = "0xa9518ADB046383a624fF64dcFB99fCfcAf5d2Bf8"; // Replace with actual owner address

    console.log("Querying balances for address:", OWNER_ADDRESS);

    const multicall = Multicall__factory.connect(MULTICALL_ADDRESS, deployer);

    // Prepare calls array
    const calls = TOKEN_ADDRESSES.map(tokenAddress => ({
        target: tokenAddress,
        callData: IERC20__factory.createInterface().encodeFunctionData('balanceOf', [OWNER_ADDRESS])
    }));


    // Make multicall
    const result = Array.from(await multicall.aggregate.staticCallResult(calls));

    const balances = result[1].map((r, index) => ({
        token: TOKEN_ADDRESSES[index],
        balance: BigInt(r as any)
    }));

    console.log({
        blockNumber: result[0],
        balances
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
