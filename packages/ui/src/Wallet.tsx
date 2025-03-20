
import { useAccount } from "wagmi";
import { Widget } from "../dist/oraidex-evm-ui";

function Wallet() {
  const account = useAccount();

  return <Widget sender={account.address} />;
}

export default Wallet;
