import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, WagmiProvider } from "wagmi";
import { SwapWithPopover } from "../SwapWithPopover";
// import "@rainbow-me/rainbowkit/styles.css";

import { Buffer as BufferPolyfill } from "buffer";
declare let Buffer: typeof BufferPolyfill;
globalThis.Buffer = BufferPolyfill;

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
        <SwapWithPopover sender={sender || "Disconnected"} />
      ) : (
        config &&
        queryClient &&
        !sender && (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <SwapWithPopover connectButton={<ConnectButton />} />
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        )
      )}
    </>
  );
};
