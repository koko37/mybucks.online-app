import React, { useContext, useState, useMemo, useEffect } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { NETWORKS } from "@mybucks/lib/conf";
import { tokens } from "@sushiswap/default-token-list";
import Token from "@mybucks/components/Token";

const EvmHome = () => {
  const { account, chainId, updateChain, reset } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [nativeBalance, setNativeBalance] = useState(0);
  const explorerUrl = useMemo(() => NETWORKS[chainId].scanner, [chainId]);

  // [TODO] fetch holding tokens list first
  const activeTokens = useMemo(
    () => tokens.filter(({ chainId: chain }) => chain == chainId).slice(0, 4),
    [chainId]
  );

  useEffect(() => {
    refreshBalances();
  }, [account]);

  const changeChain = (e) => {
    updateChain(e.target.value);
  };

  const refreshBalances = async () => {
    setLoading(true);
    setNativeBalance(await account.nativeCurrency());
    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account.address);
  };

  const tokenSelected = (token) => {
    console.log(token);
  };

  return (
    <div>
      <div>
        <select onChange={changeChain}>
          {Object.values(NETWORKS).map(({ chainId: cId, label }) => (
            <option key={cId} value={cId}>
              {label}
            </option>
          ))}
        </select>

        <button onClick={refreshBalances}>Refresh</button>
        <button>Backup</button>
        <button>Show password</button>
        <button onClick={() => reset()}>Logout</button>
      </div>

      <h2 className="text-center">
        <a href={explorerUrl + "/address/" + account.address} target="_blank">
          {account.address}
        </a>
        <button onClick={copyAddress}>Copy</button>
      </h2>

      <h1 className="text-center">{loading ? "---" : nativeBalance}</h1>

      <div>
        {activeTokens.map((t) => (
          <Token
            token={t}
            balance={2503}
            key={t.address}
            onClick={tokenSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default EvmHome;
