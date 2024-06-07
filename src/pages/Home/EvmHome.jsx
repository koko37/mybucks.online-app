import React, { useContext, useState, useMemo, useEffect } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { NETWORKS } from "@mybucks/lib/conf";

const EvmHome = () => {
  const { account, chainId, updateChain, reset } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [nativeBalance, setNativeBalance] = useState(0);
  const explorerUrl = useMemo(() => NETWORKS[chainId].scanner, [chainId]);

  useEffect(() => {
    refreshBalances();
  }, [account]);

  const refreshBalances = async () => {
    setLoading(true);
    setNativeBalance(await account.nativeCurrency());
    setLoading(false);
  };

  const onChangeChain = (e) => {
    updateChain(e.target.value);
  };

  return (
    <div>
      <h1 className="text-center">{loading ? "---" : nativeBalance}</h1>

      <h2 className="text-center">
        <a href={explorerUrl + "/address/" + account.address} target="_blank">
          {account.address}
        </a>
      </h2>

      <div>
        <button>Copy to clipboard</button>
      </div>

      <div>
        <select onChange={onChangeChain}>
          {Object.values(NETWORKS).map(({ chainId: cId, label }) => (
            <option key={cId} value={cId}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={() => reset()}>Logout</button>
      </div>
    </div>
  );
};

export default EvmHome;
