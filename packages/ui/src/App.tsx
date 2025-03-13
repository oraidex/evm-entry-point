import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { SwapWithPopover } from "./widgets";

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
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="w-full flex justify-center items-center h-[100vh] text-2xl">
            <ConnectButton />
            <SwapWithPopover />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
