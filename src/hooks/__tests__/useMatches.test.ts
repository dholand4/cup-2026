import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMatches } from '../useMatches';
import * as footballService from '../../services/footballService';

jest.mock('../../services/footballService');

const mockMatch = {
  id: 1,
  utcDate: '2026-06-17T18:00:00Z',
  status: 'SCHEDULED' as const,
  matchday: 1,
  stage: 'GROUP_STAGE',
  group: 'GROUP_A',
  lastUpdated: '2026-06-17T18:00:00Z',
  homeTeam: { id: 1, name: 'Brasil', shortName: 'Brasil', tla: 'BRA', crest: '' },
  awayTeam: { id: 2, name: 'Argentina', shortName: 'Argentina', tla: 'ARG', crest: '' },
  score: {
    winner: null,
    duration: 'REGULAR' as const,
    fullTime: { home: null, away: null },
    halfTime: { home: null, away: null },
  },
};

describe('useMatches', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (footballService.getLiveMatches as jest.Mock).mockResolvedValue([]);
    (footballService.getTodayMatches as jest.Mock).mockResolvedValue([mockMatch]);
    (footballService.getUpcomingMatches as jest.Mock).mockResolvedValue([]);
    (footballService.getRecentResults as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('starts with loading state', () => {
    const { result } = renderHook(() => useMatches());
    expect(result.current.loading).toBe(true);
  });

  it('loads matches on mount', async () => {
    const { result } = renderHook(() => useMatches());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.today).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('sets error when API fails', async () => {
    (footballService.getTodayMatches as jest.Mock).mockRejectedValue(
      new Error('Network error'),
    );
    const { result } = renderHook(() => useMatches());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
  });

  it('exposes refresh function', async () => {
    const { result } = renderHook(() => useMatches());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.refresh).toBe('function');
  });

  it('refreshes data when refresh is called', async () => {
    const { result } = renderHook(() => useMatches());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(footballService.getLiveMatches).toHaveBeenCalledTimes(2);
  });
});
