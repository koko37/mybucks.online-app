import React, { useState, useEffect, useContext, useMemo } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { ethers } from "ethers";
import { explorerLinkOfContract } from "@mybucks/lib/utils";
import s from "./index.module.css";

const Token = () => {
  const {
    account,
    chainId,
    selectedToken,
    selectToken,
    tokenBalances,
    fetchBalances,
    nativeTokenName,
    nativeTokenPrice,
    loading,
  } = useContext(StoreContext);
  const token = useMemo(
    () => tokenBalances.find((t) => t.contractAddress === selectedToken),
    [tokenBalances, selectedToken]
  );
  const balance = useMemo(
    () => ethers.formatUnits(token.balance, token.contractDecimals),
    [token]
  );

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [gasEstimation, setGasEstimation] = useState(0);
  const [gasEstimationValue, setGasEstimationValue] = useState(0);

  useEffect(() => {
    if (!recipient || !amount || !token) {
      setGasEstimation(0);
      return;
    }

    account
      .estimateGasTransferErc20(
        selectedToken,
        recipient,
        ethers.parseUnits(amount.toString(), token.contractDecimals)
      )
      .then((gasAmount) => {
        const gas = Number(
          ethers.formatUnits(account.gasPrice * gasAmount, 18)
        );
        const value = gas * nativeTokenPrice;
        setGasEstimation(gas.toFixed(6));
        setGasEstimationValue(value.toFixed(6));
      });
  }, [recipient, amount, token]);

  const returnHome = () => selectToken("");
  const setMaxAmount = () => setAmount(balance);
  const sendToken = () => {};

  return (
    <div>
      <div>
        <button onClick={returnHome}>&lt; Home</button>
        <button onClick={fetchBalances}>Refresh</button>
        {!token.nativeToken && (
          <a
            href={explorerLinkOfContract(chainId, token.contractAddress)}
            target="_blank"
          >
            <button>View contract</button>
          </a>
        )}
      </div>
      <div>
        <p className="text-center">{token.contractName}</p>
        <h2 className="text-center">
          {loading ? "---" : Number(balance).toFixed(4)}
          &nbsp;
          <span className="secondary">{token.contractTickerSymbol}</span>
        </h2>
        {token.quote && <p className="text-center">${token.quote}</p>}
      </div>

      <div>
        <h3>Send token to</h3>
      </div>
      <div>
        <label htmlFor="recipient">Recipient</label>
        <input
          id="recipient"
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={s.address}
        />
      </div>

      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={s.amount}
        />
        <button onClick={setMaxAmount}>Max</button>
      </div>

      <div>
        Estimated gas fee: {gasEstimation}&nbsp; {nativeTokenName} / $
        {gasEstimationValue}
      </div>
      <div>
        <button onClick={sendToken}>Submit</button>
      </div>

      <div>
        <h3>History</h3>
      </div>
    </div>
  );
};

export default Token;
