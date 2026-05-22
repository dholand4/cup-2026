import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIF_KEY = '@copa2026:notifSettings';

async function ensureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('copa2026', {
      name: 'Copa 2026',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00A550',
    });
  }
}

export function useNotificationSettings() {
  const [notifyFavorites, setNotifyFavorites] = useState(false);
  const [notifyAll, setNotifyAll]             = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    ensureAndroidChannel();
    AsyncStorage.getItem(NOTIF_KEY).then(raw => {
      if (raw) {
        const parsed = JSON.parse(raw);
        setNotifyFavorites(!!parsed.notifyFavorites);
        setNotifyAll(!!parsed.notifyAll);
      }
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  }, []);

  const persist = useCallback(async (nf: boolean, na: boolean) => {
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify({ notifyFavorites: nf, notifyAll: na }));
  }, []);

  const toggleNotifyFavorites = useCallback(async () => {
    const next = !notifyFavorites;
    if (next) {
      const ok = await requestPermission();
      if (!ok) return;
    }
    setNotifyFavorites(next);
    await persist(next, notifyAll);
  }, [notifyFavorites, notifyAll, requestPermission, persist]);

  const toggleNotifyAll = useCallback(async () => {
    const next = !notifyAll;
    if (next) {
      const ok = await requestPermission();
      if (!ok) return;
    }
    setNotifyAll(next);
    await persist(notifyFavorites, next);
  }, [notifyAll, notifyFavorites, requestPermission, persist]);

  return {
    notifyFavorites,
    notifyAll,
    permissionGranted,
    toggleNotifyFavorites,
    toggleNotifyAll,
    requestPermission,
  };
}
