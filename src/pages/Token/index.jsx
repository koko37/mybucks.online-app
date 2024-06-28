import React, { useState, useEffect, useContext, useMemo } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import ConfirmTransaction from "@mybucks/components/ConfirmTransaction";
import MinedTransaction from "@mybucks/components/MinedTransaction";
import { ethers } from "ethers";
import { explorerLinkOfContract } from "@mybucks/lib/utils";
import s from "./index.module.css";

const Token = () => {
  const [hasError, setHasError] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [txHash, setTxHash] = useState("");

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [gasEstimation, setGasEstimation] = useState(0);
  const [gasEstimationValue, setGasEstimationValue] = useState(0);

  const {
    account,
    chainId,
    selectedTokenAddress,
    selectToken,
    tokenBalances,
    fetchBalances,
    nativeTokenName,
    nativeTokenPrice,
    loading,
  } = useContext(StoreContext);
  const token = useMemo(
    () => tokenBalances.find((t) => t.contractAddress === selectedTokenAddress),
    [tokenBalances, selectedTokenAddress]
  );
  const balance = useMemo(
    () => ethers.formatUnits(token.balance, token.contractDecimals),
    [token]
  );

  useEffect(() => {
    const estimateGas = async () => {
      if (!recipient || !ethers.isAddress(recipient) || !amount || !token) {
        setHasError(true);
        setGasEstimation(0);
        return;
      }

      setHasError(false);
      const txData = !!token.nativeToken
        ? {
            to: recipient,
            value: ethers.parseEther(amount.toString()),
            data: null,
          }
        : await account.populateTransferErc20(
            selectedTokenAddress,
            recipient,
            ethers.parseUnits(amount.toString(), token.contractDecimals)
          );
      setTransaction(txData);

      try {
        const gasAmount = await account.estimateGas(txData);
        const gas = Number(
          ethers.formatUnits(account.gasPrice * gasAmount, 18)
        );
        const value = gas * nativeTokenPrice;
        setGasEstimation(gas.toFixed(6));
        setGasEstimationValue(value.toFixed(6));
      } catch (e) {
        setGasEstimation("");
        setGasEstimationValue("");
        setHasError(true);
      }
    };

    estimateGas();
  }, [recipient, amount, token]);

  const returnHome = () => selectToken("");
  const setMaxAmount = () => setAmount(balance);
  const sendToken = () => setConfirming(true);

  const execute = async (tx) => {
    setConfirming(false);
    setTransaction(null);
    setRecipient("");
    setAmount(0);

    setTxHash(tx.hash);
  };

  if (confirming) {
    return (
      <ConfirmTransaction
        {...transaction}
        onReject={() => setConfirming(false)}
        onSubmit={execute}
      />
    );
  }

  if (txHash) {
    return <MinedTransaction hash={txHash} back={() => setTxHash("")} />;
  }

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
        <p className="text-center">
          <img
            className={s.logo}
            src={token.logoURI}
            alt={token.contractName}
            width="48"
            height="48"
          />
        </p>
        <p className="text-center">{token.contractName}</p>
        <h2 className="text-center">
          {loading ? "???" : Number(balance).toFixed(4)}
          &nbsp;
          <span className="secondary">{token.contractTickerSymbol}</span>
        </h2>
        {!!token.quote && <p className="text-center">${token.quote}</p>}
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

      {hasError ? (
        <div>Invalid transfer</div>
      ) : (
        <div>
          Estimated gas fee: {gasEstimation}&nbsp; {nativeTokenName} / $
          {gasEstimationValue}
        </div>
      )}
      <div>
        <button onClick={sendToken} disabled={hasError}>
          Submit
        </button>
      </div>

      <h3 className="mt-h">History</h3>
    </div>
  );
};

export default Token;
