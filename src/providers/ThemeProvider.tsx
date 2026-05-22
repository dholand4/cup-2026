import React from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components/native';
import { theme } from '../constants/theme';

interface IProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: IProps) {
  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>;
}
