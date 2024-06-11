import React, { useState, useContext, useMemo } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { ethers } from "ethers";
import { explorerLinkOfContract } from "@mybucks/lib/utils";
import s from "./index.module.css";

const Transfer = () => {
  const { chainId, selectedToken, selectToken, tokenBalances, loading } =
    useContext(StoreContext);
  const token = useMemo(
    () => tokenBalances.find((t) => t.contractAddress === selectedToken),
    [tokenBalances, selectedToken]
  );
  const balance = useMemo(
    () => ethers.formatUnits(token.balance, token.contractDecimals),
    [token]
  );

  const [recipient, setRecipient] = useState();
  const [amount, setAmount] = useState();

  const returnHome = () => selectToken("");
  const setMaxAmount = () => setAmount(balance);

  return (
    <div>
      <div>
        <button onClick={returnHome}>&lt; Home</button>
        <button>Refresh</button>
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

      <div>Estimated gas fee: 0.0002 ETH</div>
      <div>
        <button>Submit</button>
      </div>

      <div>
        <h3>History</h3>
      </div>
    </div>
  );
};

export default Transfer;
