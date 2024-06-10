import React, { useContext, useState, useMemo, useEffect } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { NETWORKS } from "@mybucks/lib/conf";
import Token from "@mybucks/components/Token";
import copy from "clipboard-copy";
import { ethers } from "ethers";

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
  } = useContext(StoreContext);
  const explorerUrl = useMemo(() => NETWORKS[chainId].scanner, [chainId]);

  const changeChain = (e) => {
    updateChain(e.target.value);
  };

  const copyAddress = () => {
    copy(account.address);
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

        <button onClick={fetchBalances}>Refresh</button>
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

      <h1 className="text-center">
        {loading ? "---" : Number(nativeBalance).toFixed(4)} {nativeTokenName}
      </h1>

      <div>
        {tokenBalances
          .filter((t) => !!t.native_token)
          .map((t) => (
            <Token
              token={{
                symbol: t.contract_ticker_symbol,
                name: t.contract_name,
                logoURI: t.logoURI,
              }}
              balance={ethers.formatUnits(t.balance, t.contract_decimals)}
              quote={t.quote}
              key={t.contract_address}
              onClick={() => tokenSelected(t)}
            />
          ))}
        {tokenBalances
          .filter((t) => !t.native_token)
          .map((t) => (
            <Token
              token={{
                symbol: t.contract_ticker_symbol,
                name: t.contract_name,
                logoURI: t.logoURI,
              }}
              balance={ethers.formatUnits(t.balance, t.contract_decimals)}
              quote={t.quote}
              key={t.contract_address}
              onClick={() => tokenSelected(t)}
            />
          ))}
      </div>
    </div>
  );
};

export default EvmHome;
