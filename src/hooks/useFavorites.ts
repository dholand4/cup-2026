import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@copa2026:favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then(raw => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  const toggleFavorite = useCallback(async (tla: string) => {
    setFavorites(prev => {
      const next = prev.includes(tla)
        ? prev.filter(t => t !== tla)
        : [...prev, tla];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (tla: string) => favorites.includes(tla),
    [favorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
