import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../../../constants/theme';
import { GroupsScreen } from '../index';
import * as useStandingsHook from '../../../hooks/useStandings';

jest.mock('../../../hooks/useStandings');

const wrap = (ui: React.ReactElement) =>
  render(
    <NavigationContainer>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </NavigationContainer>,
  );

const mockGroup = {
  stage: 'GROUP_STAGE',
  type: 'TOTAL',
  group: 'GROUP_A',
  table: [
    {
      position: 1,
      team: { id: 1, name: 'Brasil', shortName: 'BRA', tla: 'BRA', crest: '' },
      playedGames: 2,
      won: 2,
      draw: 0,
      lost: 0,
      points: 6,
      goalsFor: 4,
      goalsAgainst: 0,
      goalDifference: 4,
    },
    {
      position: 2,
      team: { id: 2, name: 'Argentina', shortName: 'ARG', tla: 'ARG', crest: '' },
      playedGames: 2,
      won: 1,
      draw: 0,
      lost: 1,
      points: 3,
      goalsFor: 2,
      goalsAgainst: 2,
      goalDifference: 0,
    },
  ],
};

const mockState = {
  groups: [mockGroup],
  loading: false,
  error: null,
  refresh: jest.fn(),
};

describe('GroupsScreen', () => {
  beforeEach(() => {
    (useStandingsHook.useStandings as jest.Mock).mockReturnValue(mockState);
  });

  it('renders without crashing', () => {
    expect(wrap(<GroupsScreen />).toJSON()).toBeTruthy();
  });

  it('renders COPA 26 wordmark', () => {
    const { getByText } = wrap(<GroupsScreen />);
    expect(getByText('COPA')).toBeTruthy();
    expect(getByText('26')).toBeTruthy();
  });

  it('renders filter chips', () => {
    const { getByText } = wrap(<GroupsScreen />);
    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Grupo A')).toBeTruthy();
  });

  it('filters groups when chip pressed', () => {
    const { getByText, getAllByText } = wrap(<GroupsScreen />);
    const chip = getByText('Grupo A');
    fireEvent.press(chip);
    expect(getByText('A')).toBeTruthy(); // group letter in table header
  });

  it('shows empty state when no groups', () => {
    (useStandingsHook.useStandings as jest.Mock).mockReturnValue({
      ...mockState,
      groups: [],
    });
    const { getByText } = wrap(<GroupsScreen />);
    expect(getByText(/nenhum grupo/i)).toBeTruthy();
  });
});
