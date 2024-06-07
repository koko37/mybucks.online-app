import { createContext, useState, useEffect } from "react";
import EvmAccount from "@mybucks/lib/account";
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_NETWORK,
  NETWORK_EVM,
} from "@mybucks/lib/conf";

export const StoreContext = createContext({
  password: "",
  salt: "",
  hash: "",
  setup: (p, s, h) => {},
  reset: () => {},

  // btc | evm | solana | tron
  network: DEFAULT_NETWORK,
  chainId: DEFAULT_CHAIN_ID,
  account: null,
  updateChain: (c) => {},
});

const StoreProvider = ({ children }) => {
  // key parts
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");

  // network related
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID);
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (hash) {
      if (network === NETWORK_EVM) {
        setAccount(new EvmAccount(hash, chainId));
      }
    }
  }, [hash, chainId, network]);

  const reset = () => {
    setPassword("");
    setSalt("");
    setHash("");

    setChainId(DEFAULT_CHAIN_ID);
    setNetwork(DEFAULT_NETWORK);
    setAccount(null);
  };

  const setup = (p, s, h) => {
    setPassword(p);
    setSalt(s);
    setHash(h);
  };

  const updateChain = (id) => setChainId(id);

  return (
    <StoreContext.Provider
      value={{
        password,
        salt,
        hash,
        reset,
        setup,
        network,
        chainId,
        account,
        updateChain,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
