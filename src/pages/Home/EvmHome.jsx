import React, { useContext, useState, useMemo } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import { NETWORKS } from "@mybucks/lib/conf";
import TokenRow from "@mybucks/components/TokenRow";
import copy from "clipboard-copy";
import { ethers } from "ethers";
import { explorerLinkOfAddress, truncate } from "@mybucks/lib/utils";
import { toast } from "react-toastify";
import styled from "styled-components";
import media from "@mybucks/styles/media";

import { Container, Box } from "@mybucks/components/Containers";
import Button from "@mybucks/components/Button";

import RefreshIcon from "@mybucks/assets/icons/refresh.svg";
import ShowIcon from "@mybucks/assets/icons/show.svg";
import HideIcon from "@mybucks/assets/icons/hide.svg";
import CopyIcon from "@mybucks/assets/icons/copy.svg";
import GasIcon from "@mybucks/assets/icons/gas.svg";

const NetworkAndFeatures = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.sizes.x4l};

  ${media.md`
    margin-bottom: ${({ theme }) => theme.sizes.xl};
  `}
`;

const NetworkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.x2l};

  ${media.md`
    gap: ${({ theme }) => theme.sizes.base};
  `}
`;

const GasPriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 6rem;
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  font-weight: ${({ theme }) => theme.weights.regular};
  font-size: ${({ theme }) => theme.sizes.sm};
`;

const FeaturesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.x2l};

  ${media.md`
    display: none;
  `}
`;

const PrimaryBox = styled(Box).attrs({ $variant: "sm" })`
  margin-bottom: ${({ theme }) => theme.sizes.x4l};

  ${media.md`
    margin-bottom: ${({ theme }) => theme.sizes.xl};
  `}
`;

const AddressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: ${({ theme }) => theme.sizes.xl};

  ${media.sm`
    justify-content: space-between;
  `}
`;

const AddressAndCopy = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.xl};
`;

const AddressLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.sizes.lg};
  font-weight: ${({ theme }) => theme.weights.regular};
  line-height: 120%;
  text-decoration: underline;
`;

const AddressLong = styled.span`
  display: inherit;
  ${media.sm`
    display: none;
  `}
`;

const AddressShort = styled.span`
  display: none;
  ${media.sm`
    display: inherit;
  `}
`;

const RefreshAndEyeballs = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.xl};

  ${media.sm`
    position: relative;
  `}
`;

const NativeBalance = styled.h3`
  text-align: center;
  font-weight: ${({ theme }) => theme.weights.highlight};
  font-size: ${({ theme }) => theme.sizes.x2l};

  ${media.sm`
    font-size: ${({ theme }) => theme.sizes.xl};
  `}
`;

const FeaturesWrapper2 = styled.div`
  display: none;

  ${media.md`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.sizes.xl};
    margin-bottom: ${({ theme }) => theme.sizes.xl};
  `}
`;

const TokensList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizes.lg};
`;

const EvmHome = () => {
  const {
    password,
    salt,
    account,
    chainId,
    updateChain,
    reset,
    loading,
    nativeTokenName,
    nativeBalance,
    tokenBalances,
    tick,
    fetchBalances,
    selectToken,
  } = useContext(StoreContext);
  const [balancesVisible, setBalancesVisible] = useState(false);
  const gasPrice = useMemo(
    () => parseFloat(ethers.formatUnits(account.gasPrice, 9)).toFixed(1),
    [tick, account]
  );

  const changeChain = (e) => {
    updateChain(e.target.value);
  };
  const copyAddress = () => {
    copy(account.address);
    toast("Address copied into clipboard.");
  };
  const backupPrivateKey = () => {
    copy(account.signer);
    toast("Private key copied into clipboard.");
  };
  const backupPassword = () => {
    copy(`${password} / ${salt}`);
    toast("Password copied into clipboard.");
  };
  const toggleBalancesVisible = () => {
    setBalancesVisible(!balancesVisible);
  };
  const close = () => {
    reset();
    copy("");
  };

  return (
    <Container>
      <NetworkAndFeatures>
        <NetworkWrapper>
          <select onChange={changeChain} value={chainId}>
            {Object.values(NETWORKS).map(({ chainId: cId, label }) => (
              <option key={cId} value={cId}>
                {label}
              </option>
            ))}
          </select>
          <GasPriceWrapper $show={gasPrice > 0}>
            <img src={GasIcon} /> <span>{gasPrice} GWei</span>
          </GasPriceWrapper>
        </NetworkWrapper>

        <FeaturesWrapper>
          <Button onClick={backupPrivateKey} $size="small">
            Backup private key
          </Button>
          <Button onClick={backupPassword} $size="small">
            Backup password
          </Button>
        </FeaturesWrapper>

        <Button onClick={close} $size="small">
          Close
        </Button>
      </NetworkAndFeatures>

      <PrimaryBox>
        <AddressWrapper>
          <AddressAndCopy>
            <AddressLink
              href={explorerLinkOfAddress(chainId, account.address)}
              target="_blank"
            >
              <AddressLong>{truncate(account.address)}</AddressLong>
              <AddressShort>{truncate(account.address, 6)}</AddressShort>
            </AddressLink>

            <button onClick={copyAddress} className="img-button">
              <img src={CopyIcon} />
            </button>
          </AddressAndCopy>

          <RefreshAndEyeballs>
            <button onClick={fetchBalances}>
              <img src={RefreshIcon} />
            </button>
            <button onClick={toggleBalancesVisible} className="img-button">
              <img src={balancesVisible ? HideIcon : ShowIcon} />
            </button>
          </RefreshAndEyeballs>
        </AddressWrapper>

        <NativeBalance>
          {loading
            ? "-----"
            : !balancesVisible
            ? "*****"
            : Number(nativeBalance).toFixed(4)}
          &nbsp;
          {nativeTokenName}
        </NativeBalance>
      </PrimaryBox>

      <FeaturesWrapper2>
        <Button onClick={backupPrivateKey} $size="small">
          Backup private key
        </Button>
        <Button onClick={backupPassword} $size="small">
          Backup password
        </Button>
      </FeaturesWrapper2>

      <TokensList>
        {tokenBalances
          .filter((t) => !!t.nativeToken)
          .concat(tokenBalances.filter((t) => !t.nativeToken))
          .map((t) => (
            <TokenRow
              key={t.contractAddress}
              token={{
                symbol: t.contractTickerSymbol,
                name: t.contractName,
                logoURI: t.logoURI,
                contract: t.contractAddress,
              }}
              balance={ethers.formatUnits(t.balance, t.contractDecimals)}
              balanceVisible={balancesVisible}
              quote={t.quote}
              onClick={() => selectToken(t.contractAddress)}
            />
          ))}
      </TokensList>
    </Container>
  );
};

export default EvmHome;
