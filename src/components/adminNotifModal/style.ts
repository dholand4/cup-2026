import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.6);
  justify-content: flex-end;
`;

export const Sheet = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px 20px 40px;
`;

export const Handle = styled.View`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.border};
  align-self: center;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-family: Anton_400Regular;
  font-size: 20px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.accent.green};
  margin-bottom: 16px;
`;

export const FieldLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin-bottom: 6px;
  margin-top: 12px;
`;

export const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: Manrope_400Regular;
  font-size: 14px;
`;

export const ResultText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent.green};
  margin-top: 12px;
  text-align: center;
`;

export const SendBtn = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  background-color: ${({ theme, disabled }) => disabled ? theme.colors.border : theme.colors.accent.green};
  border-radius: 10px;
  padding: 14px 0;
`;

export const SendBtnText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: #fff;
`;

export const CloseBtn = styled.TouchableOpacity`
  margin-top: 10px;
  padding: 12px 0;
  align-items: center;
`;

export const CloseBtnText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
