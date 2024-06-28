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

const Avatar = ({ letter, bgColor }) => (
  <span className={s.avatar} style={{ backgroundColor: bgColor }}>
    {letter.toUpperCase()}
  </span>
);

const TokenRow = ({ token, balance, quote, onClick, balanceVisible }) => (
  <div className={s.token} onClick={() => onClick(token)}>
    {token.logoURI ? (
      <img src={token.logoURI} alt={token.symbol} className={s.logo} />
    ) : (
      <Avatar
        letter={token.symbol[0]}
        bgColor={"#" + token.contract.slice(2, 8)}
      />
    )}
    <div className={s.info}>
      <div>{token.symbol}</div>
      <div>{token.name}</div>
    </div>

    {balanceVisible ? <div className={s.value}>
      <h3 className={s.balance}>{Number(balance).toFixed(4)}</h3>
      {!!quote && <p>${Number(quote).toFixed(2)}</p>}
    </div> : <div className={s.value}>---</div>}
  </div>
);

export default TokenRow;
