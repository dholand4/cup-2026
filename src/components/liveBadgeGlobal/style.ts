import styled from 'styled-components/native';

export const BadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 7px;
  background-color: rgba(255, 59, 59, 0.12);
  border-width: 1px;
  border-color: rgba(255, 59, 59, 0.27);
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

export const BadgeText = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent.live};
`;

export const LiveDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.accent.live};
`;

export const FinalBadge = styled.View`
  padding: 4px 8px;
  background-color: rgba(136, 153, 170, 0.08);
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

export const FinalText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const UpcomingBadge = styled.View`
  padding: 4px 8px;
  background-color: rgba(125, 179, 255, 0.08);
  border-width: 1px;
  border-color: rgba(125, 179, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
`;

export const UpcomingText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent.scheduled};
`;
