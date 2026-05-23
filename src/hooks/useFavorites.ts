import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Carrega favoritos do Supabase sempre que o usuário muda
  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      return;
    }
    supabase
      .from('favoritos')
      .select('tla')
      .eq('usuario_id', userId)
      .then(({ data }) => {
        setFavorites((data ?? []).map((r: { tla: string }) => r.tla));
      });
  }, [userId]);

  const toggleFavorite = useCallback(async (tla: string) => {
    if (!userId) return;
    if (favorites.includes(tla)) {
      await supabase.from('favoritos').delete().eq('usuario_id', userId).eq('tla', tla);
      setFavorites(prev => prev.filter(t => t !== tla));
    } else {
      await supabase.from('favoritos').insert({ usuario_id: userId, tla });
      setFavorites(prev => [...prev, tla]);
    }
  }, [userId, favorites]);

  const isFavorite = useCallback(
    (tla: string) => favorites.includes(tla),
    [favorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
