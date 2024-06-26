import React, { useContext } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { NETWORKS } from "@mybucks/lib/conf";
import Token from "@mybucks/components/Token";
import copy from "clipboard-copy";
import { ethers } from "ethers";
import { explorerLinkOfAddress, truncate } from "@mybucks/lib/utils";

const EvmHome = () => {
  const {
    account,
    chainId,
    updateChain,
    reset,
    loading,
    nativeTokenName,
    nativeBalance,
    tokenBalances,
    fetchBalances,
    selectToken,
  } = useContext(StoreContext);

  const changeChain = (e) => {
    updateChain(e.target.value);
  };

  const copyAddress = () => {
    copy(account.address);
  };

  return (
    <div>
      <div>
        <select onChange={changeChain} value={chainId}>
          {Object.values(NETWORKS).map(({ chainId: cId, label }) => (
            <option key={cId} value={cId}>
              {label}
            </option>
          ))}
        </select>

        <button onClick={fetchBalances}>Refresh</button>
        <button>Backup Private Key</button>
        <button>Show password</button>
        <button onClick={() => reset()}>Logout</button>
      </div>

      <h2 className="text-center">
        <a
          href={explorerLinkOfAddress(chainId, account.address)}
          target="_blank"
        >
          {truncate(account.address)}
        </a>
        <button onClick={copyAddress}>Copy</button>
      </h2>

      <h1 className="text-center">
        {loading ? "---" : Number(nativeBalance).toFixed(4)} {nativeTokenName}
      </h1>

      <div>
        {tokenBalances
          .filter((t) => !!t.nativeToken)
          .concat(tokenBalances.filter((t) => !t.nativeToken))
          .map((t) => (
            <Token
              key={t.contractAddress}
              token={{
                symbol: t.contractTickerSymbol,
                name: t.contractName,
                logoURI: t.logoURI,
                contract: t.contractAddress,
              }}
              balance={ethers.formatUnits(t.balance, t.contractDecimals)}
              quote={t.quote}
              onClick={() => selectToken(t.contractAddress)}
            />
          ))}
      </div>
    </div>
  );
};

export default EvmHome;
