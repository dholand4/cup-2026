import styled from 'styled-components/native';

type QualStatus = 'in' | 'maybe' | null;

const QUAL_BG: Record<NonNullable<QualStatus>, string> = {
  in: 'rgba(0, 165, 80, 0.08)',
  maybe: 'rgba(255, 215, 0, 0.05)',
};

const QUAL_ACCENT: Record<NonNullable<QualStatus>, string> = {
  in: '#00A550',
  maybe: '#FFD700',
};

// Row layout (padding 8+10=18px, gaps 9×2=18px):
// # 16 | Team 95 | J 22 | V 22 | E 22 | D 22 | GP 22 | GC 22 | SG 22 | Pts 26
// Total: 16+95+22×7+26+18+18 = 327px — fits 360px+

export const TableCard = styled.View`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const TableHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
`;

export const GroupInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const GroupPrefix = styled.Text`
  font-family: Anton_400Regular;
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const GroupLetter = styled.Text`
  font-family: Anton_400Regular;
  font-size: 28px;
  letter-spacing: 1px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.accent.gold};
`;

export const LegendRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

export const LegendDot = styled.View<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background-color: ${({ color }) => color};
`;

export const LegendText = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ColHeaders = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 2px;
  padding: 7px 10px 7px 8px;
  background-color: rgba(0, 0, 0, 0.18);
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const ColHead = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  letter-spacing: 0px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 16px;
`;

export const ColHeadTeam = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  letter-spacing: 0px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 95px;
`;

export const ColHeadCenter = styled.Text<{ pts?: boolean }>`
  font-family: Manrope_800ExtraBold;
  font-size: 9px;
  letter-spacing: 0px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: ${({ pts }) => (pts ? '26px' : '22px')};
  text-align: center;
`;

export const StandingRow = styled.View<{ qual: QualStatus }>`
  flex-direction: row;
  align-items: center;
  gap: 2px;
  padding: 8px 10px 8px 8px;
  background-color: ${({ qual }) =>
    qual ? QUAL_BG[qual] : 'transparent'};
  border-top-width: 1px;
  border-top-color: rgba(30, 45, 64, 0.6);
  position: relative;
`;

export const QualAccent = styled.View<{ qual: NonNullable<QualStatus> }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: ${({ qual }) => QUAL_ACCENT[qual]};
`;

export const PosText = styled.Text<{ qual: QualStatus }>`
  font-family: Anton_400Regular;
  font-size: 13px;
  letter-spacing: 0px;
  color: ${({ qual, theme }) =>
    qual ? QUAL_ACCENT[qual] : theme.colors.text.secondary};
  width: 16px;
`;

export const TeamCell = styled.View`
  width: 95px;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

export const TeamNameText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StatCell = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.mid};
  width: 22px;
  text-align: center;
`;

export const SGCell = styled.Text<{ positive: boolean; negative: boolean }>`
  font-family: Manrope_600SemiBold;
  font-size: 11px;
  color: ${({ positive, negative, theme }) => {
    if (positive) return theme.colors.accent.green;
    if (negative) return '#FF6464';
    return theme.colors.text.mid;
  }};
  width: 22px;
  text-align: center;
`;

export const PtsCell = styled.Text`
  font-family: Anton_400Regular;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent.gold};
  width: 26px;
  text-align: center;
`;
