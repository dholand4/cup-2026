import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 20px 12px;
  padding: 0 12px;
  height: 38px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

export const IconWrap = styled.View`
  margin-right: 8px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-family: Manrope_500Medium;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0;
`;
