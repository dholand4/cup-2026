import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl}px ${({ theme }) => theme.spacing.xl}px;
`;

export const Message = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 22px;
`;
