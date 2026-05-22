import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../../../constants/theme';
import { ScoresScreen } from '../index';
import * as useMatchesHook from '../../../hooks/useMatches';

jest.mock('../../../hooks/useMatches');

const wrap = (ui: React.ReactElement) =>
  render(
    <NavigationContainer>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </NavigationContainer>,
  );

const mockState = {
  live: [],
  today: [],
  upcoming: [],
  recent: [],
  loading: false,
  error: null,
  refresh: jest.fn(),
};

describe('ScoresScreen', () => {
  beforeEach(() => {
    (useMatchesHook.useMatches as jest.Mock).mockReturnValue(mockState);
  });

  it('renders without crashing', () => {
    expect(wrap(<ScoresScreen />).toJSON()).toBeTruthy();
  });

  it('shows empty state when no matches today', () => {
    const { getByText } = wrap(<ScoresScreen />);
    expect(getByText(/nenhum jogo hoje/i)).toBeTruthy();
  });

  it('shows Ao Vivo section when live matches present', () => {
    const liveMatch = {
      id: 1,
      utcDate: new Date().toISOString(),
      status: 'IN_PLAY' as const,
      matchday: 1,
      stage: 'GROUP_STAGE',
      group: 'GROUP_C',
      lastUpdated: new Date().toISOString(),
      homeTeam: { id: 1, name: 'Brasil', shortName: 'BRA', tla: 'BRA', crest: '' },
      awayTeam: { id: 2, name: 'Argentina', shortName: 'ARG', tla: 'ARG', crest: '' },
      score: {
        winner: null,
        duration: 'REGULAR' as const,
        fullTime: { home: 2, away: 1 },
        halfTime: { home: 1, away: 0 },
      },
    };
    (useMatchesHook.useMatches as jest.Mock).mockReturnValue({
      ...mockState,
      live: [liveMatch],
    });
    const { getByText } = wrap(<ScoresScreen />);
    expect(getByText('Ao Vivo')).toBeTruthy();
  });

  it('shows Encerrados section for finished matches', () => {
    const finishedMatch = {
      id: 2,
      utcDate: new Date().toISOString(),
      status: 'FINISHED' as const,
      matchday: 1,
      stage: 'GROUP_STAGE',
      group: 'GROUP_D',
      lastUpdated: new Date().toISOString(),
      homeTeam: { id: 3, name: 'França', shortName: 'FRA', tla: 'FRA', crest: '' },
      awayTeam: { id: 4, name: 'Alemanha', shortName: 'GER', tla: 'GER', crest: '' },
      score: {
        winner: 'HOME_TEAM' as const,
        duration: 'REGULAR' as const,
        fullTime: { home: 1, away: 0 },
        halfTime: { home: 0, away: 0 },
      },
    };
    (useMatchesHook.useMatches as jest.Mock).mockReturnValue({
      ...mockState,
      today: [finishedMatch],
    });
    const { getByText } = wrap(<ScoresScreen />);
    expect(getByText('Encerrados')).toBeTruthy();
  });
});
