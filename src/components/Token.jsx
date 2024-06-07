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
const Token = ({ token, balance, onClick }) => (
  <div className={s.token} onClick={() => onClick(token)}>
    <img src={token.logoURI} alt={token.symbol} className={s.logo} />
    <div className={s.info}>
      <div>{token.symbol}</div>
      <div>{token.name}</div>
    </div>

    <h3 className={s.balance}>{balance}</h3>
  </div>
);

export default Token;
