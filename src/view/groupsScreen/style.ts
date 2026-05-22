import styled from 'styled-components/native';
import { TouchableOpacity, ScrollView } from 'react-native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  justify-content: center;
  align-items: center;
`;

export const Header = styled.View`
  padding: 8px 20px 14px;
`;

export const Wordmark = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

export const WordmarkCopa = styled.Text`
  font-family: Anton_400Regular;
  font-size: 28px;
  letter-spacing: 1.2px;
  color: ${({ theme }) => theme.colors.accent.green};
  line-height: 30px;
`;

export const WordmarkYear = styled.Text`
  font-family: Anton_400Regular;
  font-size: 28px;
  letter-spacing: 1.2px;
  color: ${({ theme }) => theme.colors.accent.gold};
  padding-left: 6px;
  line-height: 30px;
`;

export const SubTitle = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const FilterScroll = styled(ScrollView)`
  padding: 2px 0 14px;
`;

export const FilterChip = styled(TouchableOpacity)<{ active: boolean }>`
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.border};
`;

export const FilterChipText = styled.Text<{ active: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 11px;
  letter-spacing: 0.4px;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.mid};
  white-space: nowrap;
`;

export const GroupList = styled.View`
  padding: 4px 20px 0;
  gap: 14px;
`;

export const BottomSpacer = styled.View`
  height: 110px;
`;
