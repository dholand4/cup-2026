import styled from 'styled-components/native';
import { TouchableOpacity, ScrollView } from 'react-native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: flex-end;
`;

export const Sheet = styled.View`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 88%;
`;

export const Handle = styled.View`
  width: 36px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  align-self: center;
  margin: 12px auto 0;
`;

export const SheetScroll = styled(ScrollView)`
  padding: 0 20px;
`;

export const ScoreHeader = styled.View`
  align-items: center;
  padding: 16px 0 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  margin-bottom: 16px;
`;

export const TeamsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
`;

export const TeamCol = styled.View`
  align-items: center;
  gap: 6px;
  flex: 1;
`;

export const TeamName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.mid};
  text-align: center;
`;

export const ScoreText = styled.Text`
  font-family: Anton_400Regular;
  font-size: 40px;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: 2px;
  margin: 0 16px;
`;

export const StatusChip = styled.View`
  margin-top: 10px;
  background-color: ${({ theme }) => theme.colors.background.card};
  padding: 4px 12px;
  border-radius: 20px;
`;

export const StatusText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const LiveDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.accent.live};
`;

export const LiveRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
`;

export const LiveText = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.accent.live};
  letter-spacing: 0.5px;
`;

// ── Sections ──────────────────────────────────────────────────────────

export const SectionTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 4px;
`;

export const SectionBlock = styled.View`
  margin-bottom: 20px;
`;

// ── Eventos ───────────────────────────────────────────────────────────

export const EventRow = styled.View<{ right?: boolean }>`
  flex-direction: ${({ right }) => (right ? 'row-reverse' : 'row')};
  align-items: center;
  gap: 8px;
  padding: 5px 0;
`;

export const EventMinute = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.muted};
  width: 30px;
  text-align: center;
`;

export const EventName = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

export const EventAssist = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyEvent = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  padding: 8px 0;
`;

// ── Escalação ─────────────────────────────────────────────────────────

export const FormationText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accent.green};
  margin-bottom: 8px;
`;

export const LineupGrid = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const LineupCol = styled.View`
  flex: 1;
`;

export const LineupTeamName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 6px;
  text-align: center;
`;

export const PlayerRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
`;

export const PlayerNumber = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.muted};
  width: 16px;
  text-align: right;
`;

export const PlayerName = styled.Text`
  font-family: Manrope_500Medium;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 4px 0 16px;
`;

export const BottomSpacer = styled.View`
  height: 40px;
`;

export const CloseButton = styled(TouchableOpacity)`
  align-self: flex-end;
  padding: 4px 20px 12px;
`;

export const CloseText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
