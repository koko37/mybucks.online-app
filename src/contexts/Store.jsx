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
import camelcaseKeys from "camelcase-keys";

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

  selectedToken: "",
  selectToken: (t) => {},
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

  const [selectedToken, setSelectedToken] = useState("");

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

    setSelectedToken("");
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
          "0x620dc94C842817d5d8b8207aa2DdE4f8C8b73415"
        );
      const tokens = camelcaseKeys(data.items, { deep: true });
      setTokenBalances(
        tokens
          .filter(
            (token) => token.balance.toString() !== "0" || token.nativeToken
          )
          .map((token) => ({
            ...token,
            logoURI: defaultTokens.find((t) =>
              token.nativeToken
                ? t.name === token.contractName
                : t.address.toLowerCase() ===
                  token.contractAddress.toLowerCase()
            )?.logoURI,
          }))
      );
      setNativeBalance(
        ethers.formatUnits(tokens.find((t) => !!t.nativeToken).balance, 18)
      );
      setNativeTokenName(
        tokens.find((t) => !!t.nativeToken).contractTickerSymbol
      );
    } catch (e) {
      console.error("failed to fetch token balances ...");
    } finally {
      setLoading(false);
    }
  };

  const selectToken = (t) => setSelectedToken(t);

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
        selectedToken,
        selectToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
