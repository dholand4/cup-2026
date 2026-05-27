import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface Props {
  onEnable: () => void;
  onDismiss: () => void;
}

export function NotifPromptBanner({ onEnable, onDismiss }: Props) {
  if (Platform.OS !== 'web') return null;

  return (
    <View style={styles.bar}>
      <Ionicons name="notifications-outline" size={18} color={theme.colors.accent.green} />
      <Text style={styles.text}>Ativar notificações de jogos</Text>
      <TouchableOpacity style={styles.btn} onPress={onEnable}>
        <Text style={styles.btnText}>Ativar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDismiss} style={styles.close}>
        <Ionicons name="close" size={16} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    flexDirection:   'row',
    alignItems:      'center',
    gap:             10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth:  1,
    borderTopColor:  theme.colors.border,
    zIndex:          998,
  },
  text: {
    flex:        1,
    fontFamily:  'Manrope_400Regular',
    fontSize:    13,
    color:       theme.colors.text.primary,
  },
  btn: {
    backgroundColor: theme.colors.accent.green,
    borderRadius:    8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  btnText: {
    fontFamily: 'Manrope_700Bold',
    fontSize:   13,
    color:      '#fff',
  },
  close: {
    padding: 4,
  },
});
