import React, { useState, useEffect, useContext, useMemo } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import ConfirmTransaction from "@mybucks/pages/ConfirmTransaction";
import MinedTransaction from "@mybucks/pages/MinedTransaction";
import { ethers } from "ethers";
import styled from "styled-components";
import { explorerLinkOfContract } from "@mybucks/lib/utils";

import BackIcon from "@mybucks/assets/icons/back.svg";
import RefreshIcon from "@mybucks/assets/icons/refresh.svg";
import ArrowUpRightIcon from "@mybucks/assets/icons/arrow-up-right.svg";
import InfoRedIcon from "@mybucks/assets/icons/info-red.svg";
import InfoGreenIcon from "@mybucks/assets/icons/info-green.svg";

import {
  Container as BaseContainer,
  Box as BaseBox,
} from "@mybucks/components/Containers";
import Button from "@mybucks/components/Button";
import Input from "@mybucks/components/Input";
import { Label } from "@mybucks/components/Label";
import { H3 } from "@mybucks/components/Texts";
import media from "@mybucks/styles/media";

const Container = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.xl};
`;

const Box = styled(BaseBox)`
  width: 100%;
`;

const NavsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.sizes.x3s};
`;

const LogoAndLink = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.sizes.x3s};
`;

const Logo = styled.img`
  width: 51px;
  height: 51px;
  border-radius: 50%;
`;

const ArrowUpRight = styled.img.attrs({ src: ArrowUpRightIcon })`
  width: 16px;
`;

const TokenBalance = styled.h5`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.base};
  font-size: ${({ theme }) => theme.sizes.xl};
  font-weight: ${({ theme }) => theme.weights.regular};
  line-height: 120%;
`;

const TokenValue = styled.h6`
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.highlight};
  line-height: 150%;
`;

const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.x3s};
  margin-bottom: ${({ theme }) => theme.sizes.x2l};

  input {
    margin-bottom: 0;
  }

  ${media.sm`
    margin-bottom: ${({ theme }) => theme.sizes.xl};
  `}
`;

const MaxButton = styled(Button).attrs({ $variant: "outline" })`
  font-size: ${({ theme }) => theme.sizes.sm};
  line-height: 130%;
`;

const InvalidTransfer = styled.div`
  padding: 0.25rem 0.625rem;
  border-radius: ${({ theme }) => theme.sizes.x3s};
  color: ${({ theme }) => theme.colors.error};
  border: 1px solid ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.sizes.x2l};
  font-weight: ${({ theme }) => theme.weights.base};
  font-size: ${({ theme }) => theme.sizes.xs};
  line-height: 180%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.x2s};

  ${media.sm`
    margin-bottom: ${({ theme }) => theme.sizes.xl};
  `}
`;

const EstimatedGasFee = styled(InvalidTransfer)`
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.success};
`;

const Submit = styled(Button)`
  width: 17rem;

  ${media.sm`
    width: 100%;
  `}
`;

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
      if (!recipient && !amount) {
        setHasError(false);
        setGasEstimation(0);
        return;
      }

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
    <Container>
      <NavsWrapper>
        <button onClick={returnHome}>
          <img src={BackIcon} />
        </button>

        <button onClick={fetchBalances}>
          <img src={RefreshIcon} />
        </button>
      </NavsWrapper>

      <TokenDetails>
        <LogoAndLink>
          {!token.nativeToken && (
            <ArrowUpRight style={{ visibility: "hidden" }} />
          )}
          {token.nativeToken ? (
            <Logo src={token.logoURI} alt={token.contractTickerSymbol} />
          ) : (
            <a
              href={explorerLinkOfContract(chainId, token.contractAddress)}
              target="_blank"
            >
              <Logo src={token.logoURI} alt={token.contractTickerSymbol} />
            </a>
          )}
          {!token.nativeToken && (
            <a
              href={explorerLinkOfContract(chainId, token.contractAddress)}
              target="_blank"
            >
              <ArrowUpRight />
            </a>
          )}
        </LogoAndLink>

        <TokenBalance>
          {loading ? "---" : Number(balance).toFixed(4)}
          &nbsp;
          {token.contractTickerSymbol}
        </TokenBalance>

        {!!token.quote && (
          <TokenValue>${Number(token.quote).toFixed(4)} USD</TokenValue>
        )}
      </TokenDetails>

      <Box>
        <H3>Send token to</H3>

        <Label htmlFor="recipient">Recipient</Label>
        <Input
          id="recipient"
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <Label htmlFor="amount">Amount</Label>
        <AmountWrapper>
          <Input
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <MaxButton onClick={setMaxAmount}>Max</MaxButton>
        </AmountWrapper>

        {hasError ? (
          <InvalidTransfer>
            <img src={InfoRedIcon} />
            <span>Invalid transfer</span>
          </InvalidTransfer>
        ) : gasEstimation > 0 ? (
          <EstimatedGasFee>
            <img src={InfoGreenIcon} />
            <span>
              Estimated gas fee: {gasEstimation}&nbsp; {nativeTokenName} / $
              {gasEstimationValue}
            </span>
          </EstimatedGasFee>
        ) : (
          <></>
        )}

        <Submit onClick={sendToken} disabled={hasError || gasEstimation === 0}>
          Submit
        </Submit>
      </Box>

      <Box>
        <H3>History</H3>
      </Box>
    </Container>
  );
};

export default Token;
