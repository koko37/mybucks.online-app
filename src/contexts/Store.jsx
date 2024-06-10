import { createContext, useState, useEffect } from "react";
import EvmAccount from "@mybucks/lib/account";
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_NETWORK,
  DEFAULT_ASSET,
  NETWORK_EVM,
} from "@mybucks/lib/conf";
import { tokens as defaultTokens } from "@sushiswap/default-token-list";
import { ethers } from "ethers";
import { CovalentClient } from "@covalenthq/client-sdk";

const client = new CovalentClient(import.meta.env.VITE_COVALENT_KEY);

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

  loading: false,

  nativeTokenName: DEFAULT_ASSET,
  nativeBalance: 0,
  tokenBalances: [],
  nftBalances: [],
  fetchBalances: () => {},
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

  // common
  const [loading, setLoading] = useState(false);

  // balances related
  const [nativeTokenName, setNativeTokenName] = useState(DEFAULT_ASSET);
  const [nativeBalance, setNativeBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [nftBalances, setNftBalances] = useState([]);

  useEffect(() => {
    if (hash) {
      if (network === NETWORK_EVM) {
        setAccount(new EvmAccount(hash, chainId));
      }
    }
  }, [hash, chainId, network]);

  useEffect(() => {
    if (account) {
      fetchBalances();
    }
  }, [account]);

  const reset = () => {
    setPassword("");
    setSalt("");
    setHash("");

    setChainId(DEFAULT_CHAIN_ID);
    setNetwork(DEFAULT_NETWORK);
    setAccount(null);

    setLoading(false);

    setNativeTokenName(DEFAULT_ASSET);
    setNativeBalance(0);
    setTokenBalances([]);
    setNftBalances([]);
  };

  const setup = (p, s, h) => {
    setPassword(p);
    setSalt(s);
    setHash(h);
  };

  const updateChain = (id) => setChainId(id);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      // [TODO] replace address into account.address
      const { data } =
        await client.BalanceService.getTokenBalancesForWalletAddress(
          chainId,
          account.address
        );
      setTokenBalances(
        data.items
          .filter(
            (token) => token.balance.toString() !== "0" || token.native_token
          )
          .map((token) => ({
            ...token,
            logoURI: defaultTokens.find((t) =>
              token.native_token
                ? t.name === token.contract_name
                : t.address.toLowerCase() ===
                  token.contract_address.toLowerCase()
            )?.logoURI,
          }))
      );
      setNativeBalance(
        ethers.formatUnits(data.items.find((t) => !!t.native_token).balance, 18)
      );
      setNativeTokenName(
        data.items.find((t) => !!t.native_token).contract_ticker_symbol
      );
    } catch (e) {
      console.error("failed to fetch token balances ...");
    } finally {
      setLoading(false);
    }
  };

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
        loading,
        nativeTokenName,
        nativeBalance,
        tokenBalances,
        nftBalances,
        fetchBalances,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
