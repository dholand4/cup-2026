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
  scorer: { id: number; name: string } | null;
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

export interface AllMatchesPayload {
  live:     IMatch[];
  today:    IMatch[];
  upcoming: IMatch[];
  recent:   IMatch[];
  knockout: IMatch[];
  hasLive:  boolean;
}

export interface IMatchesResponse {
  matches: IMatch[];
}

export interface ICacheEntry<T> {
  data: T;
  timestamp: number;
}

// ── Artilheiros ───────────────────────────────────────────────────────
export interface IScorer {
  player: { id: number; name: string; nationality: string };
  team: ITeam;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

// ── Detalhe de seleção ────────────────────────────────────────────────
export interface IPlayer {
  id: number;
  name: string;
  position: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  shirtNumber: number | null;
}

export interface ICoach {
  id: number;
  name: string;
  nationality: string | null;
}

export interface ITeamDetail {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  venue: string | null;
  coach: ICoach | null;
  squad: IPlayer[];
}

// ── Detalhe de jogo ───────────────────────────────────────────────────
export interface IMatchGoal {
  minute: number;
  type: string;
  team: { id: number; name: string };
  scorer: { id: number; name: string } | null;
  assist: { id: number; name: string } | null;
}

export interface IMatchBooking {
  minute: number;
  card: 'YELLOW' | 'RED' | 'YELLOW_RED';
  team: { id: number; name: string };
  player: { id: number; name: string } | null;
}

export interface IMatchSubstitution {
  minute: number;
  team: { id: number; name: string };
  playerOut: { id: number; name: string } | null;
  playerIn: { id: number; name: string } | null;
}

export interface ILineupPlayer {
  id: number;
  name: string;
  position: string | null;
  shirtNumber: number | null;
}

export interface IMatchDetail extends IMatch {
  goals: IMatchGoal[];
  bookings: IMatchBooking[];
  substitutions: IMatchSubstitution[];
  homeTeamLineup: ILineupPlayer[];
  awayTeamLineup: ILineupPlayer[];
  homeFormation: string | null;
  awayFormation: string | null;
}
