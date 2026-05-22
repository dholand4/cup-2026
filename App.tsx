import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Incrementar esse número força limpeza do storage em todos os dispositivos
const STORAGE_VERSION = '2';
const VERSION_KEY = '@copa2026:storageVersion';
import {
  useFonts,
  Anton_400Regular,
} from '@expo-google-fonts/anton';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { ThemeProvider } from './src/providers/ThemeProvider';
import { TooltipProvider } from './src/providers/TooltipProvider';
import { FavoritesProvider } from './src/providers/FavoritesProvider';
import { NotifSettingsProvider } from './src/providers/NotifSettingsProvider';
import { MatchesProvider } from './src/providers/MatchesProvider';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { AppNavigator } from './src/routes';
import { AuthScreen } from './src/view/authScreen';
import { theme } from './src/constants/theme';

// Show notifications even when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootNavigator() {
  const { session, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: theme.colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color={theme.colors.accent.green} />
      </View>
    );
  }

  if (!session && !isGuest) return <AuthScreen />;
  return <AppNavigator />;
}

export default function App() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(VERSION_KEY).then(async v => {
      if (v !== STORAGE_VERSION) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem(VERSION_KEY, STORAGE_VERSION);
      }
      setStorageReady(true);
    });
  }, []);

  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded || !storageReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.green} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <NotifSettingsProvider>
              <MatchesProvider>
                <StatusBar style="light" backgroundColor={theme.colors.background.primary} />
                <TooltipProvider>
                  <RootNavigator />
                </TooltipProvider>
              </MatchesProvider>
            </NotifSettingsProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
