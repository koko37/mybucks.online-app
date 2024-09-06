import React, { useContext } from "react";
import { StoreContext } from "@mybucks/contexts/Store";
import styled from "styled-components";
import { toast } from "react-toastify";
import copy from "clipboard-copy";

import BackIcon from "@mybucks/assets/icons/back.svg";

import { Container, Box as BaseBox } from "@mybucks/components/Containers";
import BaseButton from "@mybucks/components/Button";
import { H3 } from "@mybucks/components/Texts";

const Box = styled(BaseBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavsWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: ${({ theme }) => theme.sizes.xl};
`;

const Title = styled(H3)`
  margin-bottom: ${({ theme }) => theme.sizes.xs};
`;

const Address = styled.p`
  width: 100%;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.sm};
  font-weight: ${({ theme }) => theme.weights.regular};
  line-height: 140%;
  margin-bottom: ${({ theme }) => theme.sizes.x2l};
  color: ${({ theme }) => theme.colors.gray200};
`;

const Button = styled(BaseButton)`
  min-width: 12rem;
  margin-bottom: ${({ theme }) => theme.sizes.x2l};
`;

const Menu = () => {
  const { openMenu, account, password, passcode } = useContext(StoreContext);

  const backupAddress = () => {
    copy(account.address);
    toast("Address copied into clipboard.");
  };

  const backupPrivateKey = () => {
    copy(account.signer);
    toast("Private key copied into clipboard.");
  };

  const backupPasswords = () => {
    copy(`${password} : ${passcode}`);
    toast("Password copied into clipboard.");
  };

  return (
    <Container>
      <NavsWrapper>
        <button onClick={() => openMenu(false)}>
          <img src={BackIcon} />
        </button>
      </NavsWrapper>

      <Box>
        <Title>Backup Account</Title>
        <Address>{account.address}</Address>

        <Button onClick={backupAddress}>Address</Button>
        <Button>Password</Button>
        <Button>Private Key</Button>
      </Box>
    </Container>
  );
};

export default Menu;
