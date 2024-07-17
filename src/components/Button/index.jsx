import React from "react";
import styled, { css } from "styled-components";

const Button = styled.button`
  font-size: ${({ theme }) => theme.sizes.base};
  font-weight: ${({ theme }) => theme.weights.highlight};
  line-height: 140%;
  background-color: ${({ theme, secondary }) =>
    !secondary ? theme.colors.primary : theme.colors.gray100};
  color: ${({ theme, secondary }) =>
    !secondary ? theme.colors.gray25 : theme.colors.gray400};
  padding: ${({ theme }) => theme.sizes.base};
  border: none;
  border-radius: ${({ theme }) => theme.radius.base};
  ${({ block }) =>
    block
      ? css`
          display: block;
          width: 100%;
        `
      : ""}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray200};
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray400};
    color: ${({ theme }) => theme.colors.gray25};
  }
`;

export default Button;
