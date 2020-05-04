import styled, { css } from 'styled-components';
import { animated } from 'react-spring';
import { ToastMessage } from '../../../hooks/Toast';

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
};

export const Container = styled(animated.div)<Pick<ToastMessage, 'type'>>`
  width: 360px;
  position: relative;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;

  ${props => toastTypeVariations[props.type || 'info']}

  & + div {
    margin-top: 8px;
  }

  > svg {
    margin-right: 16px;
  }

  div {
    flex: 1;
    p {
      margin-top: 4px;
      font-size: 12px;
      opacity: 0.8;
      line-height: 18px;
    }
  }

  button {
    background: transparent;
    color: inherit;
    border: 0;
    opacity: 0.6;

    height: 20px;
    margin-left: 16px;
    /* position: absolute; */
    /* right: 16px; */
    /* top: 19px; */
  }
`;
