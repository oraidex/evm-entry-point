import { SelectTokenWithAmount, SwapButton, ThemeProvider } from "@/components";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import WidgetQueryClientProvider from "@/components/WidgetQueryClientProvider";
import { ColorScheme, DEFAULT_CONFIG } from "@/constants/config";
import { truncateHash } from "@/lib/utils";
import { Theme } from "@/stores/persist-config/usePersistStore";
import { CustomStyles } from "@/types/swap";
import { Token } from "@/types/Token";
import { JsonRpcSigner } from "ethers";
import {
  ArrowDownUp,
  ChevronDownIcon,
  Fuel,
  Info,
  RotateCw,
  Settings,
  X,
} from "lucide-react";
import { JSX, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useBalance } from "./hooks/useBalance";
import { usePrice } from "./hooks/usePrice";
import { useSwap } from "./hooks/useSwap";
import { useToken } from "./hooks/useToken";

// Define types for the compound components
type HeaderProps = {
  className?: string;
  children?: ReactNode;
};

type TitleProps = {
  className?: string;
  children?: ReactNode;
};

type ControlsProps = {
  className?: string;
  children?: ReactNode;
};

type DirectionSwitchProps = {
  className?: string;
  onClick: () => void;
  icon?: ReactNode;
};

type FeeInfoProps = {
  className?: string;
  fee: string;
  children?: ReactNode;
};

type ContentProps = {
  className?: string;
  children?: ReactNode;
};

type ActionProps = {
  className?: string;
  children?: ReactNode;
};

export type SwapModalProps = {
  sender?: string;
  connectButton?: JSX.Element;
  signer?: JsonRpcSigner;
  className?: string;
  children?: ReactNode;
  customStyles?: Partial<CustomStyles>;
  colorScheme?: ColorScheme;
  theme?: Theme;
  showAccountInfo?: boolean;
  title?: string;
  defaultTokenFrom?: Token;
  defaultTokenTo?: Token;
  disableTokenSelectFrom?: boolean;
  disableTokenSelectTo?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};

export const Widget = (props: PropsWithChildren<SwapModalProps>) => {
  return (
    <WidgetQueryClientProvider>
      <SwapWidget {...props} />
    </WidgetQueryClientProvider>
  );
};

// Create the main component with static sub-components
export const SwapWidget = ({
  sender,
  connectButton,
  signer,
  className = "",
  customStyles = DEFAULT_CONFIG.customStyles,
  colorScheme = ColorScheme.ORAI_DEX,
  theme = Theme.DARK,
  showAccountInfo = true,
  title = "OBridge Swap",
  defaultTokenFrom = null,
  defaultTokenTo = null,
  disableTokenSelectFrom = false,
  disableTokenSelectTo = false,
  onSuccess = () => {
    console.log("swap success");
  },
  onError = () => {
    console.log("swap error");
  },
}: SwapModalProps) => {
  const { data: tokenList } = useToken({
    defaultTokenFrom,
    defaultTokenTo,
    disableTokenSelectFrom,
    disableTokenSelectTo
  });

  const finalTokenList = [...tokenList];
  if (defaultTokenFrom && !finalTokenList.find(t => t.address.evm === defaultTokenFrom.address.evm)) {
    finalTokenList.unshift(defaultTokenFrom);
  }
  if (defaultTokenTo && !finalTokenList.find(t => t.address.evm === defaultTokenTo.address.evm)) {
    finalTokenList.push(defaultTokenTo);
  }

  const {
    balances,
    refetch: refetchBalances,
    isLoading: isLoadingBalances,
  } = useBalance({
    tokenList,
    signer,
  });

  const { data: prices, isLoading: isLoadingPrices } = usePrice();

  const {
    token0,
    token1,
    amountIn,
    amountOut,
    onAmount0Change,
    handleSwap,
    setToken0,
    setToken1,
    handleReverseOrder,
    refreshSimulation,
    isAutoRefreshing,
    isSimulating,
  } = useSwap({
    tokenList,
    signer,
    refetchBalances,
    defaultTokenFrom,
    defaultTokenTo,
    onSuccess,
    onError,
  });

  return (
    <ThemeProvider
      customStyles={customStyles}
      colorScheme={colorScheme}
      theme={theme}
    >
      <div
        className={twMerge(
          "relative p-4 rounded-borderWrapperRadius overflow-hidden border-2 border-borderContainer flex flex-col w-full max-w-[var(--maxWidgetWidth)] bg-background",
          className
        )}
      >
        <div>
          <SwapWidget.Header>
            <SwapWidget.Title>{title}</SwapWidget.Title>
            <SwapWidget.Controls>
              <Drawer>
                <DrawerTrigger>
                  <Settings
                    size={20}
                    className="hover:cursor-pointer hover:rotate-45 transition-transform"
                  />
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

              <RotateCw
                size={20}
                strokeWidth={2}
                className={`hover:cursor-pointer transition-all duration-300 ${isAutoRefreshing ? "animate-spin" : "hover:rotate-180"
                  }`}
                onClick={refreshSimulation}
              />
              {!showAccountInfo ? null : sender ? (
                <div>
                  {sender == "Disconnected" ? sender : truncateHash(sender)}
                </div>
              ) : (
                connectButton
              )}
            </SwapWidget.Controls>
          </SwapWidget.Header>
        </div>

        <SwapWidget.Content>
          <div className="w-full rounded-xl flex flex-col gap-2">
            <SelectTokenWithAmount
              token={token0}
              balance={balances[token0?.address.evm || ""]}
              price={prices[token0?.address.cosmos || ""]}
              setToken={setToken0}
              tokenList={tokenList}
              amount={amountIn}
              onAmountChange={onAmount0Change}
              disableTokenSelect={disableTokenSelectFrom}
            />

            <SwapWidget.DirectionSwitch onClick={handleReverseOrder} />

            <SelectTokenWithAmount
              token={token1}
              balance={balances[token1?.address.evm || ""]}
              price={prices[token1?.address.cosmos || ""]}
              setToken={setToken1}
              tokenList={tokenList}
              amount={amountOut}
              onAmountChange={() => console.log("set amount")}
              disableInputAmount={true}
              disableTokenSelect={disableTokenSelectTo}
              className={
                isSimulating || isAutoRefreshing ? "animate-pulse" : ""
              }
            />

            <SwapWidget.FeeInfo fee="-- ORAI" />
          </div>

          <SwapWidget.Action>
            <SwapButton
              disabled={isSimulating}
              onClick={handleSwap}
              isLoading={false}
              content="Swap"
            />
          </SwapWidget.Action>
        </SwapWidget.Content>
      </div>
    </ThemeProvider>
  );
};

// Define the sub-components
SwapWidget.Header = ({ className, children }: HeaderProps) => (
  <div
    className={`w-full flex items-center text-neutralContent justify-between ${className || ""}`}
  >
    {children}
  </div>
);

SwapWidget.Title = ({ className, children }: TitleProps) => (
  <div className={className}>
    <span className="font-bold text-neutralContent">{children || "Swap"}</span>
  </div>
);

SwapWidget.Controls = ({ className, children }: ControlsProps) => (
  <div className={`flex items-center gap-4 ${className || ""}`}>{children}</div>
);

SwapWidget.DirectionSwitch = ({
  className,
  onClick,
  icon,
}: DirectionSwitchProps) => (
  <div
    className={`w-full p-2 flex justify-center items-center text-neutralContent ${className || ""}`}
  >
    <div
      onClick={onClick}
      className="p-2 bg-secondary border border-primary rounded-full text-neutralContent hover:cursor-pointer hover:brightness-125 hover:rotate-180 transition-all duration-300"
    >
      {icon || <ArrowDownUp size={24} />}
    </div>
  </div>
);

SwapWidget.FeeInfo = ({ className, fee, children }: FeeInfoProps) => (
  <Drawer>
    <DrawerTrigger>
      <div
        className={`flex justify-between rounded-boxRadius bg-foreground px-3 py-3 text-sm ${className || ""}`}
      >
        <div className="flex items-center gap-1 text-baseContent">
          <Fuel size={18} className="text-highlight" />
          <span>Estimated Fee:</span>
        </div>
        <div className="flex items-center gap-1 text-neutralContent">
          <span>{fee}</span>
          <ChevronDownIcon size={18} className="text-baseContent" />
        </div>
      </div>
    </DrawerTrigger>
    <DrawerContent aria-describedby={undefined}>
      {children || (
        <>
          <DrawerHeader>
            <DrawerTitle className="text-center text-neutralContent">
              Estimated Fee
            </DrawerTitle>
            <DrawerClose className="absolute right-4 text-neutralContent">
              <X size={20} />
            </DrawerClose>
          </DrawerHeader>
          <div className="w-full px-4 text-neutralContent">
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span>Total</span>
                </div>
                <span>≈ -- ORAI</span>
              </div>
              <div></div>
            </div>
          </div>
        </>
      )}
    </DrawerContent>
  </Drawer>
);

SwapWidget.Content = ({ className, children }: ContentProps) => (
  <div
    className={`h-full mt-4 flex flex-col items-center justify-start ${className || ""}`}
  >
    {children}
  </div>
);

SwapWidget.Action = ({ className, children }: ActionProps) => (
  <div className={`w-full mt-4 ${className || ""}`}>{children}</div>
);

SwapWidget.Footer = ({ className, children }: ActionProps) => (
  <div className={`w-full mt-4 ${className || ""}`}>{children}</div>
);

// For backward compatibility
export const SwapModal = SwapWidget;
