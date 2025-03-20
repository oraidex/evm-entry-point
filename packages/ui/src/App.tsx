import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Wallet from "./Wallet";

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
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App() {
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="m-10">
            <ConnectButton />
          </div>
          <Wallet />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
