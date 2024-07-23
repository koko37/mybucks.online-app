import React from "react";
import styled from "styled-components";

const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.gray25};
  border: 1px solid transparent;
  outline: none;
  border-radius: ${({ theme }) => theme.radius.base};
  padding: ${({ theme }) => `${theme.sizes.x3s} ${theme.sizes.base}`};
  font-size: ${({ theme }) => theme.sizes.sm};
  font-weight: ${({ theme }) => theme.weights.highlight};
  line-height: 130%;
  cursor: pointer;

  &:focus,
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

export default Select;
