import React from "react";
import s from "./index.module.css";

/*
  token: 
    symbol,
    name,
    logoURI,
    balance,
    address,
    decimals,
    chainId,
  balance:
    0
  onClick:
    (token) => void
*/
const Token = ({ token, balance, quote, onClick }) => (
  <div className={s.token} onClick={() => onClick(token)}>
    <img src={token.logoURI} alt={token.symbol} className={s.logo} />
    <div className={s.info}>
      <div>{token.symbol}</div>
      <div>{token.name}</div>
    </div>

    <div className={s.value}>
      <h3 className={s.balance}>{Number(balance).toFixed(4)}</h3>
      {quote && <p>${Number(quote).toFixed(2)}</p>}
    </div>
  </div>
);

export default Token;
