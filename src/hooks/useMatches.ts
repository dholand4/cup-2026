import { useCallback, useEffect, useRef, useState } from 'react';
import { IMatch } from '../@types';
import { getAllMatches } from '../services/footballService';
import { MOCK_MATCHES } from '../utils/mockMatches';

// Intervalo dinâmico: 30s com jogo ao vivo, 5min sem
const INTERVAL_LIVE = 30_000;
const INTERVAL_IDLE = 5 * 60_000;

interface IMatchesState {
  live:     IMatch[];
  today:    IMatch[];
  upcoming: IMatch[];
  recent:   IMatch[];
  loading:  boolean;
  error:    string | null;
}

export function useMatches() {
  const [state, setState] = useState<IMatchesState>({
    live: [], today: [], upcoming: [], recent: [],
    loading: true, error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { live, today, upcoming, recent, hasLive } = await getAllMatches();

      const mockLive    = MOCK_MATCHES.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
      const mockToday   = MOCK_MATCHES.filter(m => ['FINISHED','TIMED','SCHEDULED','IN_PLAY','PAUSED'].includes(m.status));
      const mockRecent  = MOCK_MATCHES.filter(m => m.status === 'FINISHED');
      const mockUpcoming = MOCK_MATCHES.filter(m => m.status === 'TIMED' || m.status === 'SCHEDULED');

      const allLive = [...mockLive, ...live];

      setState({
        live:     allLive,
        today:    [...mockToday,    ...today],
        upcoming: [...mockUpcoming, ...upcoming],
        recent:   [...mockRecent,   ...recent],
        loading:  false,
        error:    null,
      });

      // Ajusta intervalo dinamicamente
      const nextInterval = (hasLive || allLive.length > 0) ? INTERVAL_LIVE : INTERVAL_IDLE;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(load, nextInterval);

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
