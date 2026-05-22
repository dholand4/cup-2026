import { renderHook, waitFor } from '@testing-library/react-native';
import { useStandings } from '../useStandings';
import * as footballService from '../../services/footballService';

jest.mock('../../services/footballService');

const mockGroup = {
  stage: 'GROUP_STAGE',
  type: 'TOTAL',
  group: 'GROUP_A',
  table: [
    {
      position: 1,
      team: { id: 1, name: 'Brasil', shortName: 'BRA', tla: 'BRA', crest: '' },
      playedGames: 3,
      won: 3,
      draw: 0,
      lost: 0,
      points: 9,
      goalsFor: 7,
      goalsAgainst: 1,
      goalDifference: 6,
    },
  ],
};

describe('useStandings', () => {
  beforeEach(() => {
    (footballService.getStandings as jest.Mock).mockResolvedValue({
      standings: [mockGroup],
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('starts with loading state', () => {
    const { result } = renderHook(() => useStandings());
    expect(result.current.loading).toBe(true);
  });

  it('loads standings on mount', async () => {
    const { result } = renderHook(() => useStandings());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.groups).toHaveLength(1);
    expect(result.current.groups[0].group).toBe('GROUP_A');
    expect(result.current.error).toBeNull();
  });

  it('sets error when API fails', async () => {
    (footballService.getStandings as jest.Mock).mockRejectedValue(
      new Error('API error'),
    );
    const { result } = renderHook(() => useStandings());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('API error');
  });

  it('exposes refresh function', async () => {
    const { result } = renderHook(() => useStandings());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.refresh).toBe('function');
  });
});
