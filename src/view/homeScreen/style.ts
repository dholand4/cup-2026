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
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
`;

export const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
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

export const BrazilChip = styled.View`
  width: 18px;
  height: 13px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.accent.green};
  overflow: hidden;
  position: relative;
`;

export const BrazilDiamond = styled.View`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background-color: ${({ theme }) => theme.colors.accent.gold};
  transform: rotate(0deg);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
`;

export const BrazilCenter = styled.View`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 3px;
  background-color: #0033A0;
  top: 4px;
  left: 7px;
`;

export const SubTitle = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 0.2px;
  flex-basis: 100%;
  margin-top: 4px;
`;

export const NotifButton = styled(TouchableOpacity)`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const NotifDot = styled.View`
  position: absolute;
  top: 6px;
  right: 7px;
  width: 7px;
  height: 7px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.accent.live};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background.primary};
`;

export const HeroStrip = styled.View`
  margin: 0 20px 18px;
  padding: 12px 14px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeroLeft = styled.View`
  flex: 1;
  min-width: 0;
`;

export const HeroPhase = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent.green};
  margin-bottom: 4px;
`;

export const HeroCount = styled.Text`
  font-family: Anton_400Regular;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 0.5px;
  line-height: 26px;
`;

export const HeroRight = styled.View`
  align-items: flex-end;
  padding-left: 12px;
`;

export const HeroMinute = styled.Text`
  font-family: Anton_400Regular;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.accent.gold};
  letter-spacing: 1px;
  line-height: 32px;
`;

export const HeroLive = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.accent.live};
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-top: 2px;
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

export const SectionRight = styled(TouchableOpacity)``;

export const CardList = styled.View`
  padding: 0 20px;
  gap: 10px;
`;

export const DateLabel = styled.Text<{ today?: boolean }>`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  color: ${({ today, theme }) =>
    today ? theme.colors.accent.gold : theme.colors.text.mid};
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 16px 20px 8px;
`;

export const ErrorText = styled.Text<{ green?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ green, theme }) =>
    green ? theme.colors.accent.green : theme.colors.text.secondary};
  letter-spacing: 0.3px;
`;

export const ErrorButton = styled(TouchableOpacity)`
  margin: 16px 20px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.accent.green};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
`;

export const ErrorButtonText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.background.primary};
`;

export const FilterScroll = styled(ScrollView)`
  padding: 2px 0 8px;
`;

export const FilterChip = styled(TouchableOpacity)<{ active: boolean }>`
  padding: 6px 12px;
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
`;

export const BottomSpacer = styled.View`
  height: 110px;
`;

export const PaginationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px 4px;
`;

export const PageArrow = styled(TouchableOpacity)<{ disabled?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  border-width: 1px;
  border-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.background.elevated : theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const PageInfo = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.mid};
  text-align: center;
`;

export const PageTodayHint = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.accent.green};
  margin-top: 2px;
`;

export const FilterLabel = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: 20px;
  margin-bottom: 4px;
`;

export const DateChip = styled(TouchableOpacity)<{ active: boolean }>`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.gold : theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.accent.gold : theme.colors.border};
`;

export const DateChipText = styled.Text<{ active: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 11px;
  letter-spacing: 0.3px;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.mid};
`;

export const StageChip = styled(TouchableOpacity)<{ active: boolean }>`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.border};
`;

export const StageChipText = styled.Text<{ active: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 11px;
  letter-spacing: 0.3px;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.mid};
`;

export const TodaySection = styled.View`
  margin-bottom: 4px;
`;

export const TodayDivider = styled.View`
  margin: 20px 20px 0;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const SubSectionHeader = styled.View`
  padding: 12px 20px 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SubSectionTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TodayDateBadge = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// ── Header icons (bell + profile) ────────────────────────────────────

export const HeaderIcons = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const BellButton = styled(TouchableOpacity)`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const FavBadge = styled.View`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 7px;
  height: 7px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.accent.gold};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.background.card};
`;

// ── Todos | Favoritos filter tabs ─────────────────────────────────────

export const FilterTabs = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: 2px;
  gap: 2px;
`;

export const FilterTab = styled(TouchableOpacity)<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : 'transparent'};
`;

export const FilterTabText = styled.Text<{ active: boolean }>`
  font-family: Manrope_800ExtraBold;
  font-size: 10px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.secondary};
`;
