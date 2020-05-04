import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9800;
  border: 0;
  border-radius: 8px;
  width: 100%;
  /* height: 56px; */
  padding: 16px;
  color: #312e38;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.9s;

  &:hover {
    background: ${shade(0.3, '#ff9800')};
  }
`;
