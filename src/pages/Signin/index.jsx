import React, { useContext, useState, useMemo } from "react";
import { Buffer } from "buffer";
import { scrypt } from "scrypt-js";
import { HASH_OPTIONS } from "@mybucks/lib/conf";
import { StoreContext } from "@mybucks/contexts/Store";
import { Box } from "@mybucks/components/Containers";
import Button from "@mybucks/components/Button";
import Input from "@mybucks/components/Input";
import Checkbox from "@mybucks/components/Checkbox";
import Progress from "@mybucks/components/Progress";
import { Label } from "@mybucks/components/Label";
import { H1 } from "@mybucks/components/Texts";
import styled from "styled-components";
import media from "@mybucks/styles/media";

const Container = styled.div`
  max-width: 40.5rem;
  margin: 0 auto;
  margin-block: 4rem 6.75rem;

  @media (max-width: 696px) {
    margin: 0 ${({ theme }) => theme.sizes.xl};
    margin-block: ${({ theme }) => theme.sizes.x2l};
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.base};
  margin-bottom: ${({ theme }) => theme.sizes.x4l};

  img {
    width: 4.5rem;
    height: 4.5rem;
  }

  ${media.sm`
    margin-bottom: ${({ theme }) => theme.sizes.xl};

    img {
      width: 2.5rem;
      height: 2.5rem;
    }
  `}
`;

const LogoTitle = styled.h3`
  font-size: ${({ theme }) => theme.sizes.x2l};
  font-weight: ${({ theme }) => theme.weights.highlight};
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 150%;

  ${media.sm`
    font-size: ${({ theme }) => theme.sizes.xl};
  `}
`;

const Title = styled(H1)`
  text-align: center;
  margin-bottom: 4px;

  ${media.sm`
    font-size: 1.75rem;
    `}
`;

const Caption = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.base};
  line-height: 140%;
  margin-bottom: ${({ theme }) => theme.sizes.x2l};

  ${media.sm`
    font-size: ${({ theme }) => theme.sizes.sm};
      margin-bottom: ${({ theme }) => theme.sizes.xl};
    `}
`;

const CheckboxesWrapper = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-wrap: wrap;

  & > div {
    min-width: 50%;
  }

  ${media.sm`
    flex-direction: column;
  `}
`;

const ProgressWrapper = styled.div`
  margin-top: ${({ theme }) => theme.sizes.x2l};
  padding: 0 102px;

  ${media.sm`
    padding: 0 1.5rem;
  `}
`;

const SignIn = () => {
  const [password, setPassword] = useState(
    import.meta.env.DEV ? "ranDommPassword***$%" : ""
  );
  const [salt, setSalt] = useState(import.meta.env.DEV ? "90901210" : "");
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(0);

  const hasError = useMemo(() => !password || !salt, [password, salt]);

  const { setup } = useContext(StoreContext);

  async function onSubmit() {
    setDisabled(true);
    try {
      const passwordBuffer = Buffer.from(password);
      const saltBuffer = Buffer.from(salt);
      const hashBuffer = await scrypt(
        passwordBuffer,
        saltBuffer,
        HASH_OPTIONS.N,
        HASH_OPTIONS.r,
        HASH_OPTIONS.p,
        HASH_OPTIONS.keyLen,
        (p) => setProgress(Math.floor(p * 100))
      );
      const hashHex = Buffer.from(hashBuffer).toString("hex");
      setup(password, salt, hashHex);
    } catch (e) {
      console.error("Error while setting up account ...");
    } finally {
      setDisabled(false);
    }
  }

  return (
    <Container>
      <LogoWrapper>
        <img src="/logo-72x72.png" alt="mybucks.online" />
        <LogoTitle>myBucks.online</LogoTitle>
      </LogoWrapper>

      <Box>
        <Title>Open your account</Title>
        <Caption>Keep your password strong and secure</Caption>

        <div>
          <Label htmlFor="password1">Password 1</Label>
          <Input
            id="password1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password 1"
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="password2">Password 2</Label>
          <Input
            id="password2"
            type="password"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            placeholder="Password 2"
            disabled={disabled}
          />
        </div>

        <CheckboxesWrapper>
          <Checkbox>Min length: 12</Checkbox>
          <Checkbox>Uppercase (A~Z)</Checkbox>
          <Checkbox>Lowercase (a~z)</Checkbox>
          <Checkbox>Number (012~9)</Checkbox>
          <Checkbox>Special characters(!@#..)</Checkbox>
          <Checkbox>Don't forget!!!</Checkbox>
        </CheckboxesWrapper>

        <Button
          onClick={onSubmit}
          disabled={disabled || hasError}
          $size="block"
        >
          Open
        </Button>
      </Box>

      {!!progress && (
        <ProgressWrapper>
          <Progress value={progress} max="100" />
        </ProgressWrapper>
      )}
    </Container>
  );
};

export default SignIn;
