import { useAccount } from "wagmi";
import { Token } from "./types/Token";
import { OraiDEXSwapWagmi } from "./widgets";

const ADL: Token = {
  address: {
    cosmos:
      "factory/orai1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqtsu49d/0x27ecf170AeAfDce9921145f958bf3eb49d588E34",
    evm: "0x27ecf170AeAfDce9921145f958bf3eb49d588E34",
  },
  name: "ADL",
  symbol: "ADL",
  decimals: {
    cosmos: 18,
    evm: 18,
  },
  image: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
};

const ORAI: Token = {
  address: {
    cosmos: "orai",
    evm: "orai",
  },
  name: "ORAI",
  symbol: "ORAI",
  decimals: {
    cosmos: 6,
    evm: 18,
  },
  image: "https://images.orai.io/logo/orai-token.png",
};
function Wallet() {
  const account = useAccount();

  return (
    <OraiDEXSwapWagmi
      syncWallet={true}
      sender={account.address}
      // defaultTokenFrom={ADL}
      // defaultTokenTo={ORAI}
      // disableTokenSelectFrom={true}
      // disableTokenSelectTo={true}
    />
  );
}

export default Wallet;
