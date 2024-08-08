import React, { useContext, useState, useMemo } from "react";
import { Buffer } from "buffer";
import { scrypt } from "scrypt-js";
import {
  HASH_OPTIONS,
  RAW_PASSWORD_MIN_LENGTH,
  splitPasswordAndSalt,
} from "@mybucks/lib/conf";
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

const TEST_PASSWORD = "randommPassword82^";

const Container = styled.div`
  max-width: 40.5rem;
  margin: 0 auto;
  margin-block: 3rem 6.75rem;

  @media (max-width: 696px) {
    margin: 0 ${({ theme }) => theme.sizes.xl};
    margin-block: ${({ theme }) => theme.sizes.x2l};
  }
`;

const LogoWrapper = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.sizes.base};
  margin-bottom: ${({ theme }) => theme.sizes.x4l};

  img {
    width: 3rem;
    height: 3rem;
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
  font-size: ${({ theme }) => theme.sizes.xl};
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
  position: fixed;
  inset: 0;
  background: #fffd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  margin-block-start: -8rem;

  progress {
    max-width: 16rem;
  }
`;

const Notice = styled.p`
  text-align: center;
  max-width: 16rem;
  color: ${({ theme }) => theme.colors.gray200};
`;

const SignIn = () => {
  const { setup } = useContext(StoreContext);

  const [rawPassword, setRawPassword] = useState(
    import.meta.env.DEV ? TEST_PASSWORD : ""
  );
  const [rawPasswordConfirm, setRawPasswordConfirm] = useState(
    import.meta.env.DEV ? TEST_PASSWORD : ""
  );
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(0);

  const [password, salt] = useMemo(
    () => splitPasswordAndSalt(rawPassword),
    [rawPassword]
  );
  const hasMinLength = useMemo(
    () => rawPassword.length >= RAW_PASSWORD_MIN_LENGTH,
    [rawPassword]
  );
  const hasLowercase = useMemo(() => /[a-z]/.test(rawPassword), [rawPassword]);
  const hasUppercase = useMemo(() => /[A-Z]/.test(rawPassword), [rawPassword]);
  const hasNumbers = useMemo(() => /\d/.test(rawPassword), [rawPassword]);
  const hasSpecialChars = useMemo(
    () => /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(rawPassword),
    [rawPassword]
  );
  const hasMatchedPassword = useMemo(
    () => rawPassword && rawPassword === rawPasswordConfirm,
    [rawPassword, rawPasswordConfirm]
  );
  const hasEmpty = useMemo(
    () => !rawPassword || !password || !salt,
    [rawPassword, rawPasswordConfirm]
  );

  const hasInvalidInput = useMemo(
    () =>
      disabled ||
      hasEmpty ||
      !hasMinLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumbers ||
      !hasSpecialChars ||
      !hasMatchedPassword,
    [[rawPassword, rawPasswordConfirm, disabled]]
  );

  const onSubmit = async () => {
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
  };

  const onKeyDown = (e) => {
    if (hasInvalidInput) {
      return;
    }

    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <>
      <Container>
        <LogoWrapper href="https://mybucks.online">
          <img src="/logo-48x48.png" alt="mybucks.online" />
          <LogoTitle>mybucks.online</LogoTitle>
        </LogoWrapper>

        <Box>
          <Title>Open your account</Title>
          <Caption>Keep your password strong and secure</Caption>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              disabled={disabled}
              value={rawPassword}
              onChange={(e) => setRawPassword(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>

          <div>
            <Label htmlFor="password-confirm">Confirm Password</Label>
            <Input
              id="password-confirm"
              type="password"
              placeholder="Confirm password"
              disabled={disabled}
              value={rawPasswordConfirm}
              onChange={(e) => setRawPasswordConfirm(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>

          <CheckboxesWrapper>
            <Checkbox id="min-length" value={hasMinLength}>
              Min length: {RAW_PASSWORD_MIN_LENGTH}
            </Checkbox>
            <Checkbox id="uppercase" value={hasUppercase}>
              Uppercase (A~Z)
            </Checkbox>
            <Checkbox id="lowercase" value={hasLowercase}>
              Lowercase (a~z)
            </Checkbox>
            <Checkbox id="number" value={hasNumbers}>
              Number (012~9)
            </Checkbox>
            <Checkbox id="special" value={hasSpecialChars}>
              Special characters(!@#..)
            </Checkbox>
            <Checkbox id="match-password" value={hasMatchedPassword}>
              Match password
            </Checkbox>
          </CheckboxesWrapper>

          <Button onClick={onSubmit} disabled={hasInvalidInput} $size="block">
            Open
          </Button>
        </Box>
      </Container>

      {!!progress && (
        <ProgressWrapper>
          <img src="/logo-72x72.png" alt="mybucks.online" />
          <Notice>Hang on, it takes millions of years to brute force!</Notice>
          <Progress value={progress} max="100" />
        </ProgressWrapper>
      )}
    </>
  );
};

export default SignIn;
