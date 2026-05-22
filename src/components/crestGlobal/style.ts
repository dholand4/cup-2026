import styled from 'styled-components/native';

export const CrestContainer = styled.View<{
  size: number;
  crestColor: string;
  strokeColor: string;
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ crestColor }) => crestColor};
  border-width: 1.5px;
  border-color: ${({ strokeColor }) => `${strokeColor}88`};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

export const CrestLabel = styled.Text<{
  crestTextColor: string;
  fontSize: number;
}>`
  font-family: Anton_400Regular;
  font-size: ${({ fontSize }) => fontSize}px;
  color: ${({ crestTextColor }) => crestTextColor};
  letter-spacing: 0.4px;
  line-height: ${({ fontSize }) => fontSize + 2}px;
`;
