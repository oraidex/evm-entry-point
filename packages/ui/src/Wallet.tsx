
import { useAccount } from "wagmi";
import { OraiDEXSwapWagmi } from "./widgets";

function Wallet() {
  const account = useAccount();

  return <OraiDEXSwapWagmi syncWallet={true} sender={account.address} />;
}

export default Wallet;
