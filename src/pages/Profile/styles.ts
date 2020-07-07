import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  align-items: stretch;
  height: 100vh;

  > header {
    height: 144px;
    background: #28262e;
    display: flex;

    align-items: center;
    svg {
      margin-left: 80px;
      width: 32px;
      height: 32px;
      color: #999591;
    }
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 72px 0;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: -185px auto 0;
  width: 100%;
  form {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: auto 0;
    width: 340px;

    h1 {
      margin-bottom: 24px;
      text-align: left;
      font-size: 20px;
    }
  }
`;

export const AvatarInput = styled.div`
  position: relative;
  margin-bottom: 32px;

  background: #232129;
  border-radius: 50%;
  display: flex;
  align-self: center;
  width: 156px;
  height: 156px;
  img {
    border-radius: 50%;
    width: 156px;
    height: 156px;
    flex: 1;
  }

  label {
    position: absolute;
    bottom: 0;
    right: 0;
    border: none;
    border-radius: 50%;
    background: #ff9000;
    width: 48px;
    height: 48px;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 20px;
      width: 20px;
      color: #312e38;
    }

    input {
      display: none;
    }
    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
