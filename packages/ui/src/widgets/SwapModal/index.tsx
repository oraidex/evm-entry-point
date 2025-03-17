import { SelectTokenWithAmount, SwapButton } from "@/components";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { truncateHash } from "@/lib/utils";
import {
  ArrowDownUp,
  ChevronDownIcon,
  Fuel,
  Info,
  RotateCw,
  Settings,
  X,
} from "lucide-react";
import { JSX } from "react";
import { useSwap } from "./hooks/useSwap";
import { useToken } from "./hooks/useToken";

export type SwapModalProps = {
  sender?: string;
  connectButton?: JSX.Element;
};

export const SwapModal = ({ sender, connectButton }: SwapModalProps) => {
  const { tokenList } = useToken({});
  const { token0, token1, amountIn, amountOut, onAmount0Change } = useSwap({
    tokenList,
  });

  return (
    <div className="border flex flex-col w-[90vw] h-[500px] max-w-[420px] max-h-[500px] rounded-2xl bg-white">
      <div className="relative h-full p-4 rounded-2xl overflow-hidden">
        <div className="">
          <div className="w-full flex items-center justify-between">
            <div>
              <span className="font-bold">OraiDEX Swap</span>
            </div>
            <div className="flex items-center gap-4">
              <Drawer>
                <DrawerTrigger>
                  <Settings size={20} />
                </DrawerTrigger>
                <DrawerContent aria-describedby={undefined}>
                  <DrawerHeader>
                    <DrawerTitle className="text-center">
                      Slippage Settings
                    </DrawerTitle>
                    <DrawerClose className="absolute right-4">
                      <X size={20} />
                    </DrawerClose>
                  </DrawerHeader>
                  <div className="w-full px-4">
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span>Slippage Rate</span>
                          <Info size={16} />
                        </div>

                        <span>1%</span>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <RotateCw size={20} />
              {sender ? (
                <div>
                  {sender == "Disconnected" ? sender : truncateHash(sender)}
                </div>
              ) : (
                connectButton
              )}
            </div>
          </div>
        </div>
        <div className="h-full mt-4 flex flex-col items-center justify-start">
          <div className="w-full rounded-xl flex flex-col gap-2">
            <SelectTokenWithAmount
              token={token0}
              balance={0}
              price={0}
              tokenList={tokenList}
              amount={amountIn}
              onAmountChange={onAmount0Change}
            />

            <div className="w-full p-2 flex justify-between items-center">
              <div className="p-2 bg-secondary border rounded-full hover:cursor-pointer">
                <ArrowDownUp size={24} />
              </div>
              <div>
                <span className="text-sm font-bold">
                  1 USDT = 0.359673 ORAI
                </span>
              </div>
            </div>

            <SelectTokenWithAmount
              token={token1}
              balance={0}
              price={0}
              tokenList={tokenList}
              amount={amountOut}
              onAmountChange={() => console.log("set amount")}
              disableInputAmount={true}
              className="bg-secondary"
            />

            <Drawer>
              <DrawerTrigger>
                <div className="flex justify-between border rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Fuel size={18} />
                    <span>Estimated Fee:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>3.211 ORAI</span>
                    <ChevronDownIcon size={18} />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent aria-describedby={undefined}>
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    Estimated Fee
                  </DrawerTitle>
                  <DrawerClose className="absolute right-4">
                    <X size={20} />
                  </DrawerClose>
                </DrawerHeader>
                <div className="w-full px-4">
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span>Total</span>
                      </div>

                      <span>≈ 0.312 ORAI</span>
                    </div>
                    <div></div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="w-full mt-4">
            <SwapButton isLoading={false} content="Swap" />
          </div>
        </div>
      </div>
    </div>
  );
};
