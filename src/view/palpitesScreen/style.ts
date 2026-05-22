import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
  justify-content: center;
  align-items: center;
`;

export const Header = styled.View`
  padding: 8px 20px 10px;
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

// ── Stats ──────────────────────────────────────────────────────────────

export const StatsBar = styled.View`
  flex-direction: row;
  margin: 0 20px 4px;
  gap: 8px;
`;

export const StatChip = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 10px 8px;
  align-items: center;
`;

export const StatValue = styled.Text<{ color?: string }>`
  font-family: Anton_400Regular;
  font-size: 24px;
  color: ${({ color, theme }) => color ?? theme.colors.text.primary};
  line-height: 26px;
`;

export const StatLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 9px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

// ── Tab switcher ───────────────────────────────────────────────────────

export const TabSwitcher = styled.View`
  flex-direction: row;
  margin: 12px 20px 0;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 3px;
`;

export const TabBtn = styled(TouchableOpacity)<{ active: boolean }>`
  flex: 1;
  padding: 8px 0;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : 'transparent'};
`;

export const TabBtnText = styled.Text<{ active: boolean }>`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.secondary};
`;

// ── Pagination ─────────────────────────────────────────────────────────

export const PaginationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 4px;
`;

export const PageArrow = styled(TouchableOpacity)<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
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
  letter-spacing: 0.3px;
`;

// ── Section ────────────────────────────────────────────────────────────

export const DateLabel = styled.Text<{ today?: boolean }>`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  color: ${({ today, theme }) => today ? theme.colors.accent.gold : theme.colors.text.mid};
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 14px 20px 8px;
`;

export const CardList = styled.View`
  padding: 0 20px;
  gap: 8px;
`;

// ── Palpite card ───────────────────────────────────────────────────────

export const PalpiteCard = styled.View<{ result?: string }>`
  background-color: ${({ result, theme }) => {
    if (result === 'exact')  return 'rgba(0,165,80,0.08)';
    if (result === 'winner') return 'rgba(255,215,0,0.06)';
    if (result === 'wrong')  return 'rgba(255,59,59,0.06)';
    return theme.colors.background.card;
  }};
  border-width: 1px;
  border-color: ${({ result, theme }) => {
    if (result === 'exact')  return 'rgba(0,165,80,0.4)';
    if (result === 'winner') return 'rgba(255,215,0,0.35)';
    if (result === 'wrong')  return 'rgba(255,59,59,0.3)';
    return theme.colors.border;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 10px 12px;
  overflow: hidden;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const GroupTag = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 9px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MatchTime = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ResultBadge = styled.Text<{ result: string }>`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  letter-spacing: 0.8px;
  color: ${({ result, theme }) => {
    if (result === 'exact')  return theme.colors.accent.green;
    if (result === 'winner') return theme.colors.accent.gold;
    return theme.colors.accent.live;
  }};
`;

export const TeamsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const TeamBlock = styled.View<{ right?: boolean }>`
  flex: 1;
  flex-direction: ${({ right }) => right ? 'row-reverse' : 'row'};
  align-items: center;
  gap: 6px;
`;

export const TeamTLA = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const InputArea = styled.View`
  align-items: center;
  gap: 3px;
  min-width: 90px;
`;

export const RealScore = styled.Text`
  font-family: Anton_400Regular;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 1px;
`;

export const PalpiteLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 9px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ScoreInputRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const ScoreInput = styled.TextInput`
  font-family: Anton_400Regular;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  width: 36px;
  height: 40px;
  text-align: center;
  padding: 0;
`;

export const InputSep = styled.Text`
  font-family: Anton_400Regular;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const LockedRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 7px 10px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

export const LockedText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 0.4px;
`;

export const SaveButton = styled(TouchableOpacity)`
  margin-top: 10px;
  padding: 8px 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ theme }) => theme.colors.accent.green};
  align-items: center;
`;

export const SaveButtonText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.colors.background.primary};
`;

// ── Bracket ────────────────────────────────────────────────────────────

export const BracketSection = styled.View`
  padding: 0 20px;
  margin-top: 8px;
`;

export const RoundTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 20px 0 10px;
`;

export const RoundPts = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 10px;
  letter-spacing: 0.3px;
  text-transform: none;
  color: ${({ theme }) => theme.colors.accent.gold};
`;

export const SlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SlotChip = styled(TouchableOpacity)<{ filled?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  border-width: 1px;
  border-color: ${({ filled, theme }) =>
    filled ? theme.colors.accent.green : theme.colors.border};
  background-color: ${({ filled, theme }) =>
    filled ? 'rgba(0,165,80,0.08)' : theme.colors.background.card};
  min-width: 80px;
`;

export const SlotText = styled.Text<{ filled?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 12px;
  color: ${({ filled, theme }) =>
    filled ? theme.colors.text.primary : theme.colors.text.muted};
`;

export const SlotRemove = styled(TouchableOpacity)`
  padding: 2px;
`;

// ── Team picker modal ──────────────────────────────────────────────────

export const PickerOverlay = styled.View`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.7);
  justify-content: flex-end;
`;

export const PickerSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 70%;
  padding-bottom: 40px;
`;

export const PickerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const PickerTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 13px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
`;

export const PickerClose = styled(TouchableOpacity)`
  padding: 4px 8px;
`;

export const PickerCloseText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const SearchInput = styled.TextInput`
  margin: 10px 20px;
  padding: 9px 14px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TeamPickerRow = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const TeamPickerTLA = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 32px;
`;

export const TeamPickerName = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const BottomSpacer = styled.View`
  height: 180px;
`;

// ── Liga / Ranking ─────────────────────────────────────────────────────

export const NoLigaContainer = styled.View`
  margin: 32px 20px 0;
  align-items: center;
`;

export const NoLigaTitle = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  text-align: center;
`;

export const NoLigaSubtitle = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 20px;
  margin-bottom: 28px;
`;

export const LigaActionBtn = styled.TouchableOpacity<{ outline?: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-bottom: 10px;
  background-color: ${({ outline, theme }) =>
    outline ? 'transparent' : theme.colors.accent.green};
  border-width: ${({ outline }) => outline ? '1.5px' : '0px'};
  border-color: ${({ theme }) => theme.colors.accent.green};
`;

export const LigaActionBtnText = styled.Text<{ outline?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 15px;
  color: ${({ outline, theme }) =>
    outline ? theme.colors.accent.green : theme.colors.background.primary};
`;

export const LigaModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.7);
  justify-content: flex-end;
`;

export const LigaModalSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px 20px 40px;
`;

export const LigaModalTitle = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 20px;
  text-align: center;
`;

export const LigaInput = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 12px 14px;
  font-family: Manrope_400Regular;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
`;

export const LigaInputLabel = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 6px;
`;

export const LigaModalError = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-bottom: 8px;
`;

export const LigaCard = styled.View`
  margin: 16px 20px 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 16px;
`;

export const LigaCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const LigaName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const LigaCodeRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
`;

export const LigaCodeLabel = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const LigaCodeValue = styled.Text`
  font-family: Anton_400Regular;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.accent.green};
  letter-spacing: 2px;
`;

export const LigaLeaveBtn = styled.TouchableOpacity`
  padding: 4px 8px;
`;

export const LigaLeaveBtnText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const RankingRow = styled.View<{ isMe: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ isMe, theme }) =>
    isMe ? `${theme.colors.accent.green}11` : 'transparent'};
`;

export const RankPosition = styled.Text<{ top: boolean }>`
  font-family: Anton_400Regular;
  font-size: 18px;
  color: ${({ top, theme }) => top ? theme.colors.accent.gold : theme.colors.text.muted};
  width: 32px;
  text-align: center;
`;

export const RankApelido = styled.Text<{ isMe: boolean }>`
  flex: 1;
  font-family: Manrope_600SemiBold;
  font-size: 14px;
  color: ${({ isMe, theme }) =>
    isMe ? theme.colors.accent.green : theme.colors.text.primary};
`;

export const RankMeTag = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.accent.green};
  margin-left: 4px;
`;

export const RankPoints = styled.Text`
  font-family: Anton_400Regular;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.accent.gold};
  min-width: 40px;
  text-align: right;
`;

export const LigaListContainer = styled.View`
  margin: 16px 20px 0;
  gap: 8px;
`;

export const LigaListItem = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ active, theme }) =>
    active ? `${theme.colors.accent.green}22` : theme.colors.background.secondary};
  border-width: 1.5px;
  border-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.border};
`;

export const LigaListItemName = styled.Text<{ active: boolean }>`
  flex: 1;
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.text.primary};
`;

export const LigaListItemCode = styled.Text`
  font-family: Anton_400Regular;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: 1.5px;
  margin-right: 6px;
`;

export const LigaActionsRow = styled.View`
  flex-direction: row;
  margin: 10px 20px 0;
  gap: 8px;
`;

export const LigaActionSmallBtn = styled.TouchableOpacity<{ outline?: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  background-color: ${({ outline, theme }) =>
    outline ? 'transparent' : theme.colors.accent.green};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.accent.green};
`;

export const LigaActionSmallBtnText = styled.Text<{ outline?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ outline, theme }) =>
    outline ? theme.colors.accent.green : theme.colors.background.primary};
`;

export const GuestBanner = styled.View`
  margin: 32px 20px 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 24px 20px;
  align-items: center;
`;

export const GuestBannerText = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 22px;
  margin-bottom: 20px;
`;
