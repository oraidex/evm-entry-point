import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Wallet from "./Wallet";
import { MAINNET, TESTNET } from "./constants/network";

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

const testnetConfig = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    {
      id: TESTNET.id,
      name: TESTNET.name,
      nativeCurrency: {
        name: TESTNET.nativeCurrency.name,
        symbol: TESTNET.nativeCurrency.symbol,
        decimals: TESTNET.nativeCurrency.decimals,
      },
      rpcUrls: {
        default: {
          http: [TESTNET.rpcUrls.default.http[0]],
        },
      },
    },
  ],
  ssr: false,
});

const queryClient = new QueryClient();

function App() {

  return (
    <WagmiProvider config={testnetConfig}>
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
