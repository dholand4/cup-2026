import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND     = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'https://copa2026-backend.vercel.app';
const VAPID_PUBLIC = 'BI451-I7oWC9oJI5P_xGcVKf-HkURa0W7Kle166lFGOxMJv2LfdjP6KZeNhdLlNBW5L1atmRoLko15IvVuITxGE';
const NOTIF_KEY   = '@copa2026:notifSettings';
const FAVS_KEY    = '@copa2026:favorites';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export function useWebPush(userId: string | null) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!userId) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    async function subscribe() {
      try {
        // Lê preferências do AsyncStorage (compartilhado com APK)
        const [notifRaw, favsRaw] = await Promise.all([
          AsyncStorage.getItem(NOTIF_KEY),
          AsyncStorage.getItem(FAVS_KEY),
        ]);
        const notifSettings = notifRaw ? JSON.parse(notifRaw) : { notifyAll: true, notifyFavorites: false };
        const favorites: string[] = favsRaw ? JSON.parse(favsRaw) : [];

        // Registra o push service worker
        const reg = await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;

        // Pede permissão
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Cria ou recupera a subscription
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly:      true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
          });
        }

        // Salva no backend com preferências
        await fetch(`${BACKEND}/api/push/subscribe`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription:     sub.toJSON(),
            userId,
            notifyAll:        notifSettings.notifyAll       ?? true,
            notifyFavorites:  notifSettings.notifyFavorites ?? false,
            favorites,
          }),
        });
      } catch (e) {
        console.warn('[WebPush] subscribe error:', e);
      }
    }

    subscribe();
  }, [userId]);
}

// Chame isso sempre que o usuário mudar as preferências de notificação
export async function syncWebPushPreferences(
  userId: string,
  notifyAll: boolean,
  notifyFavorites: boolean,
  favorites: string[],
) {
  if (Platform.OS !== 'web') return;
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration('/push-sw.js');
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await fetch(`${BACKEND}/api/push/subscribe`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        userId,
        notifyAll,
        notifyFavorites,
        favorites,
      }),
    });
  } catch (e) {
    console.warn('[WebPush] sync error:', e);
  }
}
