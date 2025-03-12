import { SelectTokenWithAmount, SwapButton } from "@/components";

export const SwapModal = () => {
  return (
    <div className="border bg-black flex flex-col w-[384px] h-[600px] max-w-[384px] max-h-[75vh] rounded-2xl">
      <div className="relative h-full">
        <div className="mt-2 h-7 pl-3 pr-2">
          <div className="w-full flex items-center justify-between">
            <div>
              <span>OBridge</span>
            </div>
            <div>
              <div>Connect Wallet</div>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col items-center justify-center pb-4">
          <div className="w-full mt-2 rounded-xl flex flex-col px-2">
            <SelectTokenWithAmount
              token={{
                symbol: "ORAI",
                image: "https://github.com/shadcn.png",
                balance: 12.455,
                price: 2.37,
              }}
              amount={123}
              onAmountChange={() => console.log("set amount")}
            />

            <SelectTokenWithAmount
              token={{
                symbol: "ORAI",
                image: "https://github.com/shadcn.png",
                balance: 12.455,
                price: 2.37,
              }}
              amount={123}
              onAmountChange={() => console.log("set amount")}
            />
          </div>

          <div className="w-full">
            <SwapButton isLoading={false} content="Swap" />
          </div>
        </div>
      </div>
    </div>
  );
};
