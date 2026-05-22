import { useCallback, useEffect, useState } from 'react';
import { IScorer } from '../@types';
import { getScorers } from '../services/footballService';

interface IScorersState {
  scorers: IScorer[];
  loading: boolean;
  error: string | null;
}

export function useScorers() {
  const [state, setState] = useState<IScorersState>({
    scorers: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const scorers = await getScorers();
      setState({ scorers, loading: false, error: null });
    } catch (e) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e instanceof Error ? e.message : 'Erro ao carregar artilheiros',
      }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, refresh: load };
}
