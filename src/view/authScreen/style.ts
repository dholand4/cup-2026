import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0 24px;
  justify-content: center;
`;

export const Logo = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

export const WordmarkCopa = styled.Text`
  font-family: Anton_400Regular;
  font-size: 42px;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 4px;
`;

export const WordmarkYear = styled.Text`
  font-family: Anton_400Regular;
  font-size: 42px;
  color: ${({ theme }) => theme.colors.accent.green};
  letter-spacing: 4px;
`;

export const WordmarkRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  gap: 6px;
`;

export const Subtitle = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 24px;
`;

export const CardTitle = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 20px;
`;

export const TabRow = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 3px;
  margin-bottom: 20px;
`;

export const TabBtn = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 8px;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : 'transparent'};
`;

export const TabBtnText = styled.Text<{ active: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.secondary};
`;

export const InputLabel = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 6px;
  margin-top: 12px;
`;

export const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 12px 14px;
  font-family: Manrope_400Regular;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SubmitBtn = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.text.muted : theme.colors.accent.green};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 14px;
  align-items: center;
  margin-top: 20px;
`;

export const SubmitBtnText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.background.primary};
`;

export const ErrorText = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 10px;
  text-align: center;
`;

export const SuccessText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.success};
  margin-top: 10px;
  text-align: center;
`;

export const InfoText = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 6px;
`;

export const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 20px 0 4px;
  gap: 10px;
`;

export const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const DividerText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const GuestBtn = styled.TouchableOpacity`
  padding: 14px;
  align-items: center;
  margin-top: 8px;
`;

export const GuestBtnText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const LinkBtn = styled.TouchableOpacity`
  padding: 10px 0 2px;
  align-self: flex-end;
`;

export const LinkBtnText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accent.green};
`;

export const BackBtn = styled.TouchableOpacity`
  padding: 10px 0 2px;
  align-self: flex-start;
`;

export const BackBtnText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const InputWrap = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;

export const InputInner = styled.TextInput`
  flex: 1;
  padding: 12px 14px;
  font-family: Manrope_400Regular;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const EyeBtn = styled.TouchableOpacity`
  padding: 10px 14px;
`;
