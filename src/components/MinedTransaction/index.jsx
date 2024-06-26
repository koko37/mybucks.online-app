import React, { useContext } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { explorerLinkOfTransaction, truncate } from "@mybucks/lib/utils";

const MinedTransaction = ({ hash, back }) => {
  const { chainId } = useContext(StoreContext);

  return (
    <div>
      <div>
        <button onClick={back}>&lt; Back</button>
      </div>

      <h2>Transaction mined!</h2>
      <div>Hash: {truncate(hash)}</div>
      <div>
        <a href={explorerLinkOfTransaction(chainId, hash)} target="_blank">
          View on explorer
        </a>
      </div>
    </div>
  );
};

export default MinedTransaction;
