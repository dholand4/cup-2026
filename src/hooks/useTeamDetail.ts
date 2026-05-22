import { useCallback, useEffect, useState } from 'react';
import { ITeamDetail } from '../@types';
import { getTeamDetail } from '../services/footballService';

interface ITeamDetailState {
  team: ITeamDetail | null;
  loading: boolean;
  error: string | null;
}

export function useTeamDetail(teamId: number | null) {
  const [state, setState] = useState<ITeamDetailState>({
    team: null,
    loading: false,
    error: null,
  });

  const load = useCallback(async (id: number) => {
    setState({ team: null, loading: true, error: null });
    try {
      const team = await getTeamDetail(id);
      setState({ team, loading: false, error: null });
    } catch (e) {
      setState({
        team: null,
        loading: false,
        error: e instanceof Error ? e.message : 'Erro ao carregar seleção',
      });
    }
  }, []);

  useEffect(() => {
    if (teamId != null) load(teamId);
  }, [teamId, load]);

  return { ...state, refresh: () => teamId != null && load(teamId) };
}
