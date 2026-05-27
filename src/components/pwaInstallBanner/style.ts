import styled from 'styled-components/native';
import { theme } from '../../constants/theme';

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.6);
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 999;
`;

export const Banner = styled.View`
  background-color: ${theme.colors.background.secondary};
  border-radius: 20px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  padding: 24px 20px 20px;
  width: 100%;
  max-width: 360px;
`;

export const BannerContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
`;

export const BannerIcon = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: rgba(0, 165, 80, 0.12);
  align-items: center;
  justify-content: center;
`;

export const BannerTexts = styled.View`
  flex: 1;
`;

export const BannerTitle = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 16px;
  color: ${theme.colors.text.primary};
`;

export const BannerSubtitle = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 13px;
  color: ${theme.colors.text.secondary};
  margin-top: 3px;
  line-height: 18px;
`;

export const BannerActions = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: 6px;
`;

export const InstallBtn = styled.TouchableOpacity`
  flex: 1;
  background-color: ${theme.colors.accent.green};
  border-radius: 10px;
  padding: 12px 0;
  align-items: center;
`;

export const InstallBtnText = styled.Text`
  font-family: Manrope_700Bold;
  font-size: 14px;
  color: #fff;
`;

export const DismissBtn = styled.TouchableOpacity`
  flex: 1;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${theme.colors.border};
  padding: 12px 0;
  align-items: center;
`;

export const DismissBtnText = styled.Text`
  font-family: Manrope_600SemiBold;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const IOSStep = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px 12px;
  background-color: ${theme.colors.background.elevated};
  border-radius: 10px;
`;

export const IOSStepText = styled.Text`
  font-family: Manrope_400Regular;
  font-size: 13px;
  color: ${theme.colors.text.mid};
  flex: 1;
`;
