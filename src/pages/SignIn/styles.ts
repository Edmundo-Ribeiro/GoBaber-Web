import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import backimg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  display: flex;
  align-items: stretch;
  height: 100vh;
`;

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Content = styled.div`
  animation: ${appear} 2s;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 72px 0;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  form {
    text-align: center;
    margin: auto 0;
    width: 340px;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 16px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.3, '#f4ede8')};
      }
    }
  }

  > a {
    color: #ff9800;
    display: flex;
    align-items: center;
    margin-top: auto;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.3, '#ff9800')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;
export const SideImage = styled.div`
  flex: 1;
  background: url(${backimg}) no-repeat center;
  background-size: cover;
`;
