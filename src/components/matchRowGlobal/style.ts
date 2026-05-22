import styled from 'styled-components/native';

export const Row = styled.View<{ live?: boolean; finished?: boolean }>`
  background-color: ${({ live, finished, theme }) => {
    if (live) return 'rgba(255,59,59,0.06)';
    if (finished) return 'rgba(0,165,80,0.06)';
    return theme.colors.background.card;
  }};
  border-width: 1px;
  border-color: ${({ live, finished, theme }) => {
    if (live) return 'rgba(255,59,59,0.3)';
    if (finished) return 'rgba(0,165,80,0.25)';
    return theme.colors.border;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: 9px 12px;
  overflow: hidden;
`;

export const RowMain = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const LiveAccent = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.accent.live};
`;

export const FinishedAccent = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.accent.green};
`;

export const GroupLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 9px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  width: 40px;
`;

export const TeamInfo = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const TeamNameWrap = styled.View`
  width: 36px;
  align-items: center;
`;

export const TeamName = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ScoreWrap = styled.View`
  flex-direction: row;
  align-items: center;
  min-width: 36px;
  justify-content: center;
`;

export const ScoreText = styled.Text<{ bold?: boolean; lead?: boolean; muted?: boolean }>`
  font-family: ${({ bold }) => (bold ? 'Anton_400Regular' : 'Manrope_600SemiBold')};
  font-size: ${({ bold }) => (bold ? '16px' : '13px')};
  color: ${({ lead, muted, theme }) => {
    if (lead) return theme.colors.accent.gold;
    if (muted) return theme.colors.text.secondary;
    return theme.colors.text.primary;
  }};
`;

export const VsText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StatusLabel = styled.Text<{ live?: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 10px;
  color: ${({ live, theme }) =>
    live ? theme.colors.accent.live : theme.colors.text.secondary};
  letter-spacing: 0.4px;
  text-align: right;
  min-width: 36px;
`;

export const GoalsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: 6px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  width: 100%;
`;

export const GoalsSide = styled.View<{ right?: boolean }>`
  align-items: ${({ right }) => (right ? 'flex-end' : 'flex-start')};
  gap: 2px;
`;

export const GoalEntry = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 0.2px;
`;
