import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, WagmiProvider } from "wagmi";
import { SwapWithPopover } from "../SwapWithPopover";
import { ColorScheme } from "@/constants/config";
import { DEFAULT_CONFIG } from "@/constants/config";
import { Theme } from "@/stores/persist-config/usePersistStore";

export type OraiDEXSwapWagmiProps = {
  syncWallet: boolean;
  sender?: string;
  config?: Config;
  queryClient?: QueryClient;
};

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    {
      id: 108160679,
      name: "Oraichain Mainnet",
      nativeCurrency: {
        name: "Oraichain",
        symbol: "ORAI",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["https://evm.orai.io"],
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
}: OraiDEXSwapWagmiProps) => {
  return (
    <>
      {syncWallet ? (
        <SwapWithPopover
          sender={sender || "Disconnected"}
          customStyles={DEFAULT_CONFIG.customStyles}
          colorScheme={ColorScheme.CUSTOM}
          theme={Theme.DARK}
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
                />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        )
      )}
    </>
  );
};
