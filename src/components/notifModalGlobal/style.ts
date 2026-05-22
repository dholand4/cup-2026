import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: flex-end;
`;

export const Sheet = styled.View`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-bottom: 40px;
  max-height: 85%;
`;

export const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const SheetTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 13px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CloseBtn = styled(TouchableOpacity)`
  padding: 4px 8px;
`;

export const CloseBtnText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// ── Toggle row ────────────────────────────────────────────────────────

export const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
`;

export const ToggleLeft = styled.View`
  flex: 1;
  margin-right: 16px;
`;

export const ToggleLabel = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ToggleDesc = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

export const ToggleTrack = styled(TouchableOpacity)<{ active: boolean }>`
  width: 46px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : theme.colors.background.elevated};
  justify-content: center;
  padding: 2px;
  align-items: ${({ active }) => active ? 'flex-end' : 'flex-start'};
`;

export const ToggleThumb = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${({ theme }) => theme.colors.text.primary};
`;

// ── Divider ───────────────────────────────────────────────────────────

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 4px 0;
`;

export const SectionLabel = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 14px 20px 8px;
`;

// ── Favorited team chip ───────────────────────────────────────────────

export const FavList = styled.View`
  padding: 0 20px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FavChip = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  background-color: rgba(0, 165, 80, 0.1);
  border-width: 1px;
  border-color: rgba(0, 165, 80, 0.35);
`;

export const FavChipText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const FavChipRemove = styled(TouchableOpacity)`
  padding: 1px 2px;
`;

export const FavChipRemoveText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const AddTeamBtn = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: dashed;
`;

export const AddTeamBtnText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.mid};
`;

export const EmptyFavText = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 20px 12px;
`;

// ── Team picker (within same modal) ──────────────────────────────────

export const PickerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const PickerTitle = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.primary};
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

export const TeamRow = styled(TouchableOpacity)<{ favorited?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ favorited }) =>
    favorited ? 'rgba(0, 165, 80, 0.06)' : 'transparent'};
`;

export const TeamRowLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const TeamTLA = styled.Text`
  font-family: Manrope_800ExtraBold;
  font-size: 11px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 32px;
`;

export const TeamName = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
