import { ColorScheme, DEFAULT_CONFIG } from "@/constants/config";
import { MAINNET } from "@/constants/network";
import { Theme } from "@/stores/persist-config/usePersistStore";
import { Token } from "@/types/Token";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, WagmiProvider } from "wagmi";
import { SwapWithPopover } from "../SwapWithPopover";

export type OraiDEXSwapWagmiProps = {
  syncWallet: boolean;
  sender?: string;
  config?: Config;
  queryClient?: QueryClient;
  defaultTokenFrom?: Token;
  defaultTokenTo?: Token;
  disableTokenSelectFrom?: boolean;
  disableTokenSelectTo?: boolean;
};

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    {
      id: MAINNET.id,
      name: MAINNET.name,
      nativeCurrency: {
        name: MAINNET.nativeCurrency.name,
        symbol: MAINNET.nativeCurrency.symbol,
        decimals: MAINNET.nativeCurrency.decimals,
      },
      rpcUrls: {
        default: {
          http: [MAINNET.rpcUrls.default.http[0]],
        },
      },
    },
  ],
  ssr: false,
});

const queryClient = new QueryClient();

export const OraiDEXSwapWagmi = ({
  syncWallet,
  sender,
  defaultTokenFrom,
  defaultTokenTo,
  disableTokenSelectFrom,
  disableTokenSelectTo,
}: OraiDEXSwapWagmiProps) => {
  return (
    <>
      {syncWallet ? (
        <SwapWithPopover
          sender={sender || "Disconnected"}
          customStyles={DEFAULT_CONFIG.customStyles}
          colorScheme={ColorScheme.CUSTOM}
          theme={Theme.DARK}
          defaultTokenFrom={defaultTokenFrom}
          defaultTokenTo={defaultTokenTo}
          disableTokenSelectFrom={disableTokenSelectFrom}
          disableTokenSelectTo={disableTokenSelectTo}
        />
      ) : (
        config &&
        queryClient &&
        !sender && (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <SwapWithPopover
                  connectButton={<ConnectButton />}
                  customStyles={DEFAULT_CONFIG.customStyles}
                  colorScheme={ColorScheme.CUSTOM}
                  theme={Theme.DARK}
                  defaultTokenFrom={defaultTokenFrom}
                  defaultTokenTo={defaultTokenTo}
                  disableTokenSelectFrom={disableTokenSelectFrom}
                  disableTokenSelectTo={disableTokenSelectTo}
                />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        )
      )}
    </>
  );
};
