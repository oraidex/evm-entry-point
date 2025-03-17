import "@rainbow-me/rainbowkit/styles.css";

import { useAccount } from "wagmi";
import { OraiDEXSwapWagmi } from "./widgets/OraiDEXSwapWagmi";

function Wallet() {
  const account = useAccount();

  return <OraiDEXSwapWagmi syncWallet={true} sender={account.address} />;
}

export default Wallet;
