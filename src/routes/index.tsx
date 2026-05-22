import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootTabParamList } from './types';
import { HomeScreen } from '../view/homeScreen';
import { PalpitesScreen } from '../view/palpitesScreen';
import { GroupsScreen } from '../view/groupsScreen';
import { theme } from '../constants/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_CONFIG = [
  {
    name: 'GroupsScreen' as const,
    label: 'Grupos',
    iconActive: 'podium' as const,
    iconInactive: 'podium-outline' as const,
  },
  {
    name: 'HomeScreen' as const,
    label: 'Jogos',
    iconActive: 'football' as const,
    iconInactive: 'football-outline' as const,
  },
  {
    name: 'PalpitesScreen' as const,
    label: 'Palpites',
    iconActive: 'trophy' as const,
    iconInactive: 'trophy-outline' as const,
  },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <BarWrapper paddingBottom={insets.bottom}>
      <BarPill>
        {state.routes.map((route, index) => {
          const tab = TAB_CONFIG[index];
          const isFocused = state.index === index;

          return (
            <TabItem
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              active={isFocused}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.iconInactive}
                size={22}
                color={isFocused ? theme.colors.background.primary : theme.colors.text.secondary}
              />
              <TabLabel active={isFocused}>{tab.label}</TabLabel>
            </TabItem>
          );
        })}
      </BarPill>
    </BarWrapper>
  );
}

const BarWrapper = styled.View<{ paddingBottom: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 12px ${({ paddingBottom }) => Math.max(paddingBottom, 12)}px;
  background-color: transparent;
`;

const BarPill = styled.View`
  background-color: rgba(17, 24, 39, 0.92);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: 6px;
  flex-direction: row;
`;

const TabItem = styled(TouchableOpacity)<{ active: boolean }>`
  flex: 1;
  align-items: center;
  padding: 8px 4px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.accent.green : 'transparent'};
`;

const TabLabel = styled.Text<{ active: boolean }>`
  font-family: Manrope_700Bold;
  font-size: 10px;
  letter-spacing: 0.5px;
  margin-top: 2px;
  color: ${({ active, theme }) =>
    active ? theme.colors.background.primary : theme.colors.text.secondary};
`;

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
        initialRouteName="HomeScreen"
      >
        <Tab.Screen name="GroupsScreen" component={GroupsScreen} />
        <Tab.Screen name="HomeScreen" component={HomeScreen} initialParams={{}} />
        <Tab.Screen name="PalpitesScreen" component={PalpitesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
