import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Container, Input, IconWrap } from './style';

interface ISearchBarGlobalProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBarGlobal({ value, onChangeText, placeholder = 'Buscar seleção...' }: ISearchBarGlobalProps) {
  return (
    <Container>
      <IconWrap>
        <Ionicons name="search-outline" size={15} color={theme.colors.text.secondary} />
      </IconWrap>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.secondary}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </Container>
  );
}
