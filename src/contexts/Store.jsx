import { createContext, useState, useEffect, useMemo } from "react";
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

export const StoreContext = createContext({
  client: null,
  connectivity: true,
  password: "",
  passcode: "",
  salt: "",
  hash: "",
  setup: (p, pc, s, h) => {},
  reset: () => {},

  // evm | tron
  network: DEFAULT_NETWORK,
  chainId: DEFAULT_CHAIN_ID,
  account: null,
  updateChain: (c) => {},

  loading: false,
  inMenu: false,
  openMenu: (m) => {},

  nativeTokenName: DEFAULT_ASSET,
  nativeBalance: 0,
  tokenBalances: [],
  nftBalances: [],

  nativeTokenPrice: 0,
  tick: 0,

  fetchBalances: () => {},

  selectedTokenAddress: "",
  selectToken: (t) => {},
});

const StoreProvider = ({ children }) => {
  const client = useMemo(
    () => new CovalentClient(import.meta.env.VITE_COVALENT_API_KEY),
    []
  );
  const [connectivity, setConnectivity] = useState(true);
  // key parts
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");
  const [salt, setSalt] = useState("");
  const [hash, setHash] = useState("");

  // network related
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID);
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const [account, setAccount] = useState(null);

  // common
  const [loading, setLoading] = useState(false);
  const [inMenu, openMenu] = useState(false);

  // balances related
  const [nativeTokenName, setNativeTokenName] = useState(DEFAULT_ASSET);
  const [nativeBalance, setNativeBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [nftBalances, setNftBalances] = useState([]);

  // prices related
  const [nativeTokenPrice, setNativeTokenPrice] = useState(0);

  // unique counter that increments regularly
  const [tick, setTick] = useState(0);

  // active token
  const [selectedTokenAddress, selectToken] = useState("");

  useEffect(() => {
    if (hash) {
      if (network === NETWORK_EVM) {
        setAccount(new EvmAccount(hash, chainId));
      }
    }
  }, [hash, chainId, network]);

  useEffect(() => {
    if (!account) {
      return;
    }
    account.getGasPrice().then(() => {
      setTick((_tick) => _tick + 1);
    });
    fetchBalances();

    const intervalId = setInterval(() => {
      account
        .getGasPrice()
        .then(() => {
          setConnectivity(true);
        })
        .catch(() => {
          setConnectivity(false);
        })
        .finally(() => {
          setTick((_tick) => _tick + 1);
        });
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [account]);

  const reset = () => {
    setPassword("");
    setPasscode("");
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

    selectToken("");
  };

  const setup = (pw, pc, s, h) => {
    setPassword(pw);
    setPasscode(pc);
    setSalt(s);
    setHash(h);
  };

  const updateChain = (id) => setChainId(id);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const { data, error } =
        await client.BalanceService.getTokenBalancesForWalletAddress(
          chainId,
          account.address
        );
      if (error) {
        throw new Error("invalid balances");
      }
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
      setNativeTokenPrice(tokens.find((t) => !!t.nativeToken).quoteRate);
      setConnectivity(true);
    } catch (e) {
      setConnectivity(false);
      console.error("failed to fetch token balances ...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        client,
        connectivity,
        password,
        passcode,
        salt,
        hash,
        reset,
        setup,
        network,
        chainId,
        account,
        updateChain,
        loading,
        inMenu,
        openMenu,
        nativeTokenName,
        nativeBalance,
        tokenBalances,
        nftBalances,
        nativeTokenPrice,
        tick,
        fetchBalances,
        selectedTokenAddress,
        selectToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
