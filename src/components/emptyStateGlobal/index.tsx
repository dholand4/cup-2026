import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Container, Message } from './style';
import { theme } from '../../constants/theme';

interface IEmptyStateGlobalProps {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyStateGlobal({
  message,
  icon = 'football-outline',
}: IEmptyStateGlobalProps) {
  return (
    <Container>
      <Ionicons
        name={icon}
        size={48}
        color={theme.colors.text.secondary}
        style={{ marginBottom: 16 }}
      />
      <Message>{message}</Message>
    </Container>
  );
}
