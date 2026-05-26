import styled from 'styled-components/native';
import { theme } from '../../constants/theme';

export const Banner = styled.View`
  background-color: ${theme.colors.background.elevated};
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  padding: 14px 16px 10px;
`;

export const BannerContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

export const BannerIcon = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: rgba(0, 165, 80, 0.1);
  align-items: center;
  justify-content: center;
`;

export const BannerTexts = styled.View`
  flex: 1;
`;

export const BannerTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const BannerSubtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  margin-top: 2px;
`;

export const BannerActions = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-top: 4px;
`;

export const InstallBtn = styled.TouchableOpacity`
  flex: 1;
  background-color: ${theme.colors.accent.green};
  border-radius: 8px;
  padding: 9px 0;
  align-items: center;
`;

export const InstallBtnText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #fff;
`;

export const DismissBtn = styled.TouchableOpacity`
  flex: 1;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  padding: 9px 0;
  align-items: center;
`;

export const DismissBtnText = styled.Text`
  font-size: 13px;
  color: ${theme.colors.text.secondary};
`;

export const IOSStep = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  padding-left: 4px;
`;

export const IOSStepText = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text.mid};
`;
