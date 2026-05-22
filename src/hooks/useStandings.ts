import { useCallback, useEffect, useState } from 'react';
import { IGroup } from '../@types';
import { getStandings } from '../services/footballService';
import { clearCache } from '../services/cacheService';

interface IStandingsState {
  groups: IGroup[];
  loading: boolean;
  error: string | null;
}

export function useStandings() {
  const [state, setState] = useState<IStandingsState>({
    groups: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async (bustCache = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    if (bustCache) await clearCache('cache:standings');
    try {
      const data = await getStandings();
      // Filter to TOTAL type only (avoids HOME/AWAY duplicates)
      // and only real groups (group field not null, table max 4 teams)
      const realGroups = data.standings.filter(
        s => s.type === 'TOTAL' && s.group != null && s.table.length <= 6,
      );
      setState({ groups: realGroups, loading: false, error: null });
    } catch (e) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e instanceof Error ? e.message : 'Erro ao carregar tabela',
      }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, refresh: load };
}
