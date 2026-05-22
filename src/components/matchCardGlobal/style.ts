import styled from 'styled-components/native';

export const Card = styled.View<{ highlighted?: boolean; compact?: boolean }>`
  background-color: ${({ highlighted, theme }) =>
    highlighted ? theme.colors.background.cardAlt : theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ highlighted, theme }) =>
    highlighted ? theme.colors.borderHi : theme.colors.border};
  border-radius: 12px;
  padding: ${({ compact }) => compact ? '8px 12px 8px' : '14px 14px 12px'};
  overflow: hidden;
`;

export const LiveAccent = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.accent.live};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const GroupTag = styled.Text<{ gold?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ gold, theme }) => (gold ? theme.colors.accent.gold : theme.colors.text.secondary)};
  padding: 4px 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: rgba(255, 255, 255, 0.02);
  overflow: hidden;
`;

export const TeamsGrid = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const TeamCol = styled.View`
  flex: 1;
  align-items: center;
  gap: 6px;
`;

export const TLA = styled.Text`
  font-family: Anton_400Regular;
  font-size: 18px;
  letter-spacing: 1.2px;
  color: ${({ theme }) => theme.colors.text.primary};
  padding-top: 2px;
`;

export const ScoreBlock = styled.View`
  min-width: 80px;
  align-items: center;
  padding: 0 4px;
`;

export const ScoreRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const ScoreNum = styled.Text<{ gold?: boolean; muted?: boolean; compact?: boolean }>`
  font-family: Anton_400Regular;
  font-size: ${({ muted, compact }) => muted ? (compact ? 20 : 26) : (compact ? 32 : 44)}px;
  letter-spacing: 1px;
  color: ${({ gold, muted, theme }) => {
    if (muted) return theme.colors.text.secondary;
    if (gold) return theme.colors.accent.gold;
    return theme.colors.text.primary;
  }};
  line-height: ${({ muted, compact }) => muted ? (compact ? 24 : 32) : (compact ? 36 : 48)}px;
`;

export const ScoreSep = styled.Text`
  font-family: Anton_400Regular;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding-bottom: 4px;
`;

export const MinuteText = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.accent.live};
  letter-spacing: 0.8px;
  margin-top: 4px;
`;

export const TimeHint = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 0.6px;
  margin-top: 6px;
`;

export const FinalLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

// ── Big live card (ScoresScreen) ─────────────────────────────────────

export const BigCard = styled.View<{ compact?: boolean }>`
  background-color: #0B1424;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.borderHi};
  border-radius: 12px;
  padding: ${({ compact }) => compact ? '10px 12px 12px' : '16px 16px 18px'};
  overflow: hidden;
`;

export const CornerAccent = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 59, 59, 0.2);
  border-bottom-right-radius: 60px;
`;

export const PitchCircle = styled.View`
  position: absolute;
  right: -40px;
  top: 50%;
  margin-top: -70px;
  width: 140px;
  height: 140px;
  border-radius: 70px;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.border};
  opacity: 0.5;
`;

export const BigTeamName = styled.Text<{ compact?: boolean }>`
  font-family: Anton_400Regular;
  font-size: ${({ compact }) => compact ? '14px' : '20px'};
  letter-spacing: 1.2px;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ compact }) => compact ? '16px' : '22px'};
  text-align: center;
`;

export const TeamRole = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 0.6px;
  margin-top: 4px;
`;

export const BigScoreRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const BigScoreNum = styled.Text<{ gold?: boolean; compact?: boolean }>`
  font-family: Anton_400Regular;
  font-size: ${({ compact }) => compact ? '44px' : '64px'};
  letter-spacing: 1.5px;
  color: ${({ gold, theme }) =>
    gold ? theme.colors.accent.gold : theme.colors.text.primary};
  line-height: ${({ compact }) => compact ? '48px' : '68px'};
`;

export const BigScoreSep = styled.Text<{ compact?: boolean }>`
  font-family: Anton_400Regular;
  font-size: ${({ compact }) => compact ? '24px' : '36px'};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding-bottom: 6px;
`;

export const BigMinuteText = styled.Text<{ compact?: boolean }>`
  font-family: Anton_400Regular;
  font-size: ${({ compact }) => compact ? '13px' : '18px'};
  color: ${({ theme }) => theme.colors.accent.live};
  letter-spacing: 1.5px;
  margin-top: ${({ compact }) => compact ? '4px' : '8px'};
  text-align: center;
`;

export const BigPeriodText = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-top: 3px;
  text-align: center;
`;

export const CardTeamName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-top: 4px;
  letter-spacing: 0.2px;
`;

export const ScorersRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const ScorerSide = styled.View<{ right?: boolean }>`
  align-items: ${({ right }) => (right ? 'flex-end' : 'flex-start')};
  gap: 3px;
`;

export const ScorerEntry = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.mid};
`;
