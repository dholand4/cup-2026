import { useCallback, useEffect, useRef, useState } from 'react';
import { IMatch } from '../@types';
import { getAllMatches } from '../services/footballService';

// Intervalo dinâmico: 30s com jogo ao vivo, 5min sem
const INTERVAL_LIVE = 30_000;
const INTERVAL_IDLE = 5 * 60_000;

interface IMatchesState {
  live:     IMatch[];
  today:    IMatch[];
  upcoming: IMatch[];
  recent:   IMatch[];
  knockout: IMatch[];
  loading:  boolean;
  error:    string | null;
}

export function useMatches() {
  const [state, setState] = useState<IMatchesState>({
    live: [], today: [], upcoming: [], recent: [], knockout: [],
    loading: true, error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (silent = false) => {
    // Só mostra loading na primeira carga — polls silenciosos não travam a tela
    if (!silent) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    try {
      const { live, today, upcoming, recent, knockout, hasLive } = await getAllMatches();

      setState({
        live,
        today,
        upcoming,
        recent,
        knockout,
        loading: false,
        error:   null,
      });

      const nextInterval = (hasLive || live.length > 0) ? INTERVAL_LIVE : INTERVAL_IDLE;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => load(true), nextInterval);

    } catch (e) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e instanceof Error ? e.message : 'Erro ao carregar jogos',
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  return { ...state, refresh: load };
}
