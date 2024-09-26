import React from "react";
import styled from "styled-components";
import { Container, Box as BaseBox } from "@mybucks/components/Containers";
import { H3 } from "@mybucks/components/Texts";
import Link from "@mybucks/components/Link";
import { truncate } from "@mybucks/lib/utils";

import BackIcon from "@mybucks/assets/icons/back.svg";
import SuccessIcon from "@mybucks/assets/icons/success.svg";

const NavsWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: ${({ theme }) => theme.sizes.xl};
`;

const Box = styled(BaseBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.x2l};
`;

const Title = styled(H3)`
  margin-bottom: 0;
`;

const Hash = styled.p`
  color: ${({ theme }) => theme.colors.gray200};
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.regular};
  line-height: 140%;
`;

const MinedTransaction = ({ txnHash, txnLink, back }) => (
  <Container>
    <NavsWrapper>
      <button onClick={back}>
        <img src={BackIcon} />
      </button>
    </NavsWrapper>

    <Box>
      <Title>Transaction mined!</Title>
      <img src={SuccessIcon} />
      <Hash>Hash: {truncate(txnHash)}</Hash>
      <Link href={txnLink} target="_blank">
        View on explorer
      </Link>
    </Box>
  </Container>
);

export default MinedTransaction;
