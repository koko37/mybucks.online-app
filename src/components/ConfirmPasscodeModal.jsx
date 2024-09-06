import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { StoreContext } from "@mybucks/contexts/Store";
import Modal from "@mybucks/components/Modal";
import Input from "@mybucks/components/Input";
import { H3 } from "@mybucks/components/Texts";
import Button from "@mybucks/components/Button";
import {
  PASSCODE_MIN_LENGTH,
  PASSCODE_MAX_LENGTH,
  PASSCODE_MAX_TRY,
} from "@mybucks/lib/conf";

const Wrap = styled.div`
  display: flex;
  max-width: 20rem;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizes.xl};
`;

const Title = styled(H3)`
  margin-bottom: ${({ theme }) => theme.sizes.xs};
  text-align: center;
`;

const InvalidPasscode = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.weights.base};
  font-size: ${({ theme }) => theme.sizes.xs};
  line-height: 180%;
  margin-bottom: ${({ theme }) => theme.sizes.xs};
`;

const ConfirmPasscodeModal = ({ show, onSuccess, onFailed }) => {
  const [counter, setCounter] = useState(0);
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const { passcode } = useContext(StoreContext);

  const confirmPasscode = () => {
    if (value.length < PASSCODE_MIN_LENGTH) {
      return;
    }

    if (passcode !== value) {
      setInvalid(true);
      setCounter(counter + 1);

      if (counter + 1 >= PASSCODE_MAX_TRY) {
        toast("Wrong passcode!");

        setValue("");
        setInvalid(false);
        setCounter(0);
        onFailed();
      } else {
        return;
      }
    } else {
      setInvalid(false);
    }

    setValue("");
    setInvalid(false);
    setCounter(0);
    onSuccess();
  };

  const onClose = () => {
    setValue("");
    setInvalid(false);
    setCounter(0);
    onFailed();
  };

  const onKeyDown = (e) => {
    setInvalid(false);

    if (e.key === "Enter") {
      confirmPasscode();
    }
  };

  return (
    <Modal
      focusTrap={true}
      show={show}
      close={onClose}
      showCloseIcon={false}
      width="20rem"
    >
      <Wrap>
        <Title>Confirm Passcode</Title>
        <Input
          type="password"
          placeholder="Passcode"
          minLength={PASSCODE_MIN_LENGTH}
          maxLength={PASSCODE_MAX_LENGTH}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={(e) => e.preventDefault()}
        />
        {invalid && <InvalidPasscode>Wrong passcode!</InvalidPasscode>}
        <Button
          onClick={confirmPasscode}
          disabled={value.length < PASSCODE_MIN_LENGTH}
        >
          Confirm
        </Button>
      </Wrap>
    </Modal>
  );
};

export default ConfirmPasscodeModal;
