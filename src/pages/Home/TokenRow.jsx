import React from "react";
import styled from "styled-components";

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

const Wrap = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => theme.sizes.base};
  background-color: ${({ theme }) => theme.colors.gray25};
  border: 2px solid transparent;

  &:hover {
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Logo = styled.img`
  width: 51px;
  height: 51px;
  border-radius: 50%;
`;

const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray25};
  width: 51px;
  height: 51px;
  border-radius: 50%;
  font-size: ${({ theme }) => theme.sizes.x2l};
`;

const SymbolAndNameWrap = styled.div`
  margin-left: ${({ theme }) => theme.sizes.xs};
  flex-grow: 1;
`;

const Symbol = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.highlight};
  line-height: 150%;
  margin-bottom: ${({ theme }) => theme.sizes.x3s};
`;

const Name = styled.p`
  color: ${({ theme }) => theme.colors.gray200};
  font-size: ${({ theme }) => theme.sizes.xs};
  font-weight: ${({ theme }) => theme.weights.regular};
  line-height: 150%;
`;

const BalanceAndValueWrap = styled.div``;

const Balance = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.highlight};
  line-height: 150%;
  margin-bottom: 6px;
  text-align: right;
`;

const Value = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.sizes.sm};
  font-weight: ${({ theme }) => theme.weights.regular};
  line-height: 150%;
  text-align: right;
  min-height: 21px;
`;

const TokenRow = ({ token, balance, quote, onClick, balanceVisible }) => (
  <Wrap onClick={() => onClick(token)}>
    {token.logoURI ? (
      <Logo src={token.logoURI} alt={token.symbol} />
    ) : (
      <Avatar style={{ backgroundColor: "#" + token.contract.slice(2, 8) }}>
        {token.symbol[0].toUpperCase()}
      </Avatar>
    )}
    <SymbolAndNameWrap>
      <Symbol>{token.symbol}</Symbol>
      <Name>{token.name}</Name>
    </SymbolAndNameWrap>

    <BalanceAndValueWrap>
      <Balance>{balanceVisible ? Number(balance).toFixed(4) : "*****"}</Balance>
      <Value>
        {!!quote && balanceVisible
          ? `\$${Number(quote).toFixed(2)}`
          : !balanceVisible
          ? "*****"
          : ""}
      </Value>
    </BalanceAndValueWrap>
  </Wrap>
);

export default TokenRow;
