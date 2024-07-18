import React, { useContext } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { explorerLinkOfTransaction, truncate } from "@mybucks/lib/utils";
import { H3 } from "@mybucks/components/Texts";

const MinedTransaction = ({ hash, back }) => {
  const { chainId } = useContext(StoreContext);

  return (
    <div className="app">
      <div>
        <button onClick={back}>&lt; Back</button>
      </div>

      <H3>Transaction mined!</H3>
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
