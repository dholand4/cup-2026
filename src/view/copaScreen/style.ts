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

export const TabSwitcher = styled.View`
  flex-direction: row;
  margin: 0 20px 14px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  padding: 3px;
`;

export const TabBtn = styled(TouchableOpacity)<{ active: boolean }>`
  flex: 1;
  align-items: center;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm - 2}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : 'transparent'};
`;

export const TabBtnText = styled.Text<{ active: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 12px;
  letter-spacing: 0.3px;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.secondary};
`;

// ── Grupos tab ────────────────────────────────────────────────────────

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
`;

export const GroupList = styled.View`
  padding: 4px 20px 0;
  gap: 14px;
`;

// ── Artilheiros tab ───────────────────────────────────────────────────

export const ScorerCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin: 0 20px 8px;
  gap: 12px;
`;

export const ScorerRank = styled.Text`
  font-family: Anton_400Regular;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.muted};
  width: 24px;
  text-align: center;
`;

export const ScorerInfo = styled.View`
  flex: 1;
`;

export const ScorerName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ScorerTeam = styled.Text`
  font-family: Manrope_500Medium;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 1px;
`;

export const ScorerStats = styled.View`
  align-items: flex-end;
  gap: 2px;
`;

export const ScorerGoals = styled.Text`
  font-family: Anton_400Regular;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.accent.green};
`;

export const ScorerAssists = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const ScorerHeader = styled.View`
  flex-direction: row;
  padding: 0 20px 8px;
  gap: 12px;
`;

export const ScorerHeaderText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
`;

// ── Seleções tab ──────────────────────────────────────────────────────

export const TeamCard = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin: 0 20px 8px;
  gap: 12px;
`;

export const TeamCardInfo = styled.View`
  flex: 1;
`;

export const TeamCardName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TeamCardGroup = styled.Text`
  font-family: Manrope_500Medium;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 1px;
`;

// ── Team Profile Modal ────────────────────────────────────────────────

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: flex-end;
`;

export const ModalSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 88%;
`;

export const ModalHandle = styled.View`
  width: 36px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  align-self: center;
  margin: 12px auto 4px;
`;

export const ModalScroll = styled(ScrollView)`
  padding: 0 20px;
`;

export const ModalCloseBtn = styled(TouchableOpacity)`
  align-self: flex-end;
  padding: 4px 20px 8px;
`;

export const ModalCloseText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TeamProfileHeader = styled.View`
  align-items: center;
  padding: 8px 20px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  margin-bottom: 16px;
`;

export const TeamProfileName = styled.Text`
  font-family: Anton_400Regular;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 10px;
  letter-spacing: 1px;
`;

export const TeamProfileDetail = styled.Text`
  font-family: Manrope_500Medium;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const SectionLabel = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 4px;
  padding: 0 20px;
`;

export const CoachCard = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin: 0 20px 16px;
`;

export const CoachName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CoachNat = styled.Text`
  font-family: Manrope_500Medium;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const PlayerItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 7px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  gap: 10px;
`;

export const PlayerNum = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
  width: 20px;
  text-align: right;
`;

export const PlayerNameText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

export const PlayerPos = styled.Text`
  font-family: Manrope_500Medium;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const BottomSpacer = styled.View`
  height: 110px;
`;

// ── Chaveamento tab ───────────────────────────────────────────────────

export const BracketRoundSection = styled.View`
  margin: 0 12px 16px;
`;

export const BracketRoundHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  margin-bottom: 10px;
`;

export const BracketRoundLabel = styled.Text`
  font-family: Anton_400Regular;
  font-size: 14px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const BracketRoundCount = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const BracketSidesRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const BracketSide = styled.View`
  flex: 1;
  gap: 6px;
`;

export const BracketSideLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.colors.accent.green};
  text-transform: uppercase;
  margin-bottom: 2px;
`;

export const BracketMatchBox = styled.View`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const BracketTeamLine = styled.View<{ winner?: boolean; tbd?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 5px 7px;
  gap: 5px;
  background-color: ${({ winner, theme }) =>
    winner ? 'rgba(0,165,80,0.12)' : 'transparent'};
`;

export const BracketTLA = styled.Text<{ winner?: boolean; tbd?: boolean }>`
  font-family: ${({ tbd }) => tbd ? 'Manrope_400Regular' : 'Manrope_700Bold'};
  font-size: ${({ tbd }) => tbd ? '9px' : '11px'};
  color: ${({ winner, tbd, theme }) =>
    tbd ? theme.colors.text.muted :
    winner ? theme.colors.accent.green :
    theme.colors.text.primary};
  flex: 1;
`;

export const BracketScoreNum = styled.Text<{ winner?: boolean }>`
  font-family: Anton_400Regular;
  font-size: 14px;
  color: ${({ winner, theme }) =>
    winner ? theme.colors.accent.green : theme.colors.text.mid};
  min-width: 14px;
  text-align: right;
`;

export const BracketMatchDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const BracketMatchStatus = styled.Text<{ live?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 8px;
  letter-spacing: 0.4px;
  text-align: center;
  padding: 3px 4px;
  color: ${({ live, theme }) =>
    live ? theme.colors.accent.live : theme.colors.text.muted};
  background-color: ${({ live, theme }) =>
    live ? 'rgba(255,59,59,0.08)' : theme.colors.background.primary};
`;

export const BracketFinalSection = styled.View`
  margin: 4px 20px 16px;
  align-items: center;
`;

export const BracketFinalLabel = styled.Text`
  font-family: Anton_400Regular;
  font-size: 18px;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.accent.gold};
  margin-bottom: 12px;
  text-align: center;
`;

export const BracketFinalCard = styled.View`
  width: 100%;
  max-width: 280px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.accent.gold};
  overflow: hidden;
`;

export const BracketFinalTeamLine = styled.View<{ winner?: boolean; tbd?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 10px 14px;
  gap: 10px;
  background-color: ${({ winner, theme }) =>
    winner ? 'rgba(0,165,80,0.12)' : 'transparent'};
`;

export const BracketFinalTLA = styled.Text<{ winner?: boolean; tbd?: boolean }>`
  font-family: ${({ tbd }) => tbd ? 'Manrope_400Regular' : 'Anton_400Regular'};
  font-size: ${({ tbd }) => tbd ? '12px' : '16px'};
  letter-spacing: 1px;
  color: ${({ winner, tbd, theme }) =>
    tbd ? theme.colors.text.muted :
    winner ? theme.colors.accent.green :
    theme.colors.text.primary};
  flex: 1;
`;

export const BracketFinalScore = styled.Text<{ winner?: boolean }>`
  font-family: Anton_400Regular;
  font-size: 22px;
  color: ${({ winner, theme }) =>
    winner ? theme.colors.accent.green : theme.colors.text.mid};
`;

export const ChampionBanner = styled.View`
  align-items: center;
  padding: 16px;
  margin-top: 8px;
  background-color: rgba(255,215,0,0.06);
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.accent.gold};
  gap: 8px;
`;

export const ChampionLabel = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 10px;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.accent.gold};
  text-transform: uppercase;
`;

export const ChampionName = styled.Text`
  font-family: Anton_400Regular;
  font-size: 24px;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.accent.gold};
`;
