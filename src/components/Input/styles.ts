import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused?: boolean;
  isFilled?: boolean;
  isError?: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #232129;
  border: 2px solid;
  border-radius: 8px;
  width: 100%;
  padding: 12px;
  display: flex;
  align-items: center;

  border-color: #232129;
  color: #666360;

  ${props =>
    props.isError &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      border-color: #ff9000;
      color: #ff9000;
    `}

  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}


  & + div {
    margin-top: 8px;
  }

  input {
    background: transparent;
    color: #f4ede8;
    border: 0;
    flex: 1;
    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 8px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  svg {
    margin: 0;
    margin-left: 16px;
  }
  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
