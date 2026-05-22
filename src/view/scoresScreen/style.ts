import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  justify-content: center;
  align-items: center;
`;

export const Header = styled.View`
  padding: 8px 20px 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
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
  letter-spacing: 0.2px;
  flex-basis: 100%;
  margin-top: 4px;
`;

export const RefreshButton = styled(TouchableOpacity)`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const SectionHeader = styled.View`
  padding: 18px 20px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SectionRight = styled.View``;

export const SectionRightText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const CardList = styled.View`
  padding: 0 20px;
  gap: 10px;
`;

export const BottomSpacer = styled.View`
  height: 110px;
`;
