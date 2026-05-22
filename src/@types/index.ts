export interface ITeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface IGoal {
  minute: number;
  team: { id: number; name: string };
  scorer: { id: number; name: string };
  type: string;
}

export interface IScore {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CANCELLED';

export interface IMatch {
  id: number;
  utcDate: string;
  status: MatchStatus;
  minute?: number;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: ITeam;
  awayTeam: ITeam;
  score: IScore;
  goals?: IGoal[];
}

export interface IStanding {
  position: number;
  team: ITeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface IGroup {
  stage: string;
  type: string;
  group: string;
  table: IStanding[];
}

export interface IStandingsResponse {
  standings: IGroup[];
}

export interface IMatchesResponse {
  matches: IMatch[];
}

export interface ICacheEntry<T> {
  data: T;
  timestamp: number;
}
