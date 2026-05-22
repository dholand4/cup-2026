import { useCallback, useEffect, useState } from 'react';
import { IMatchDetail } from '../@types';
import { getMatchDetail } from '../services/footballService';

interface IMatchDetailState {
  detail: IMatchDetail | null;
  loading: boolean;
  error: string | null;
}

export function useMatchDetail(matchId: number | null) {
  const [state, setState] = useState<IMatchDetailState>({
    detail: null,
    loading: false,
    error: null,
  });

  const load = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const detail = await getMatchDetail(id);
      setState({ detail, loading: false, error: null });
    } catch (e) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e instanceof Error ? e.message : 'Erro ao carregar jogo',
      }));
    }
  }, []);

  useEffect(() => {
    if (matchId != null) load(matchId);
  }, [matchId, load]);

  return { ...state, refresh: () => matchId != null && load(matchId) };
}
