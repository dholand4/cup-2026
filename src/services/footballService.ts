import {
  IMatch, IStandingsResponse, AllMatchesPayload,
  IScorer, ITeamDetail, IMatchDetail,
} from '../@types';
import { translateTeam } from '../utils/teamNames';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://copa2026-backend.vercel.app';

function translateMatch(m: IMatch): IMatch {
  return {
    ...m,
    homeTeam: translateTeam(m.homeTeam),
    awayTeam: translateTeam(m.awayTeam),
  };
}

async function backendFetch<T>(path: string): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API erro ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Partidas ──────────────────────────────────────────────────────────

export async function getAllMatches(): Promise<AllMatchesPayload> {
  const data = await backendFetch<AllMatchesPayload>('/api/matches');
  return {
    live:     (data.live     ?? []).map(translateMatch),
    today:    (data.today    ?? []).map(translateMatch),
    upcoming: (data.upcoming ?? []).map(translateMatch),
    recent:   (data.recent   ?? []).map(translateMatch),
    hasLive:  data.hasLive ?? false,
  };
}

// ── Classificação ─────────────────────────────────────────────────────

export async function getStandings(): Promise<IStandingsResponse> {
  const data = await backendFetch<{ standings: any[] }>('/api/standings');
  return {
    standings: (data.standings ?? []).map((group: any) => ({
      ...group,
      table: group.table.map((row: any) => ({
        ...row,
        team: translateTeam(row.team),
      })),
    })),
  };
}

// ── Artilheiros ───────────────────────────────────────────────────────

export async function getScorers(): Promise<IScorer[]> {
  const data = await backendFetch<{ scorers: IScorer[] }>('/api/scorers');
  return data.scorers ?? [];
}

// ── Detalhe de seleção ────────────────────────────────────────────────

export async function getTeamDetail(id: number): Promise<ITeamDetail> {
  return backendFetch<ITeamDetail>(`/api/team/${id}`);
}

// ── Detalhe de jogo ───────────────────────────────────────────────────

export async function getMatchDetail(id: number): Promise<IMatchDetail> {
  const data = await backendFetch<any>(`/api/match/${id}`);
  return {
    ...translateMatch(data),
    goals:          data.goals          ?? [],
    bookings:       data.bookings       ?? [],
    substitutions:  data.substitutions  ?? [],
    homeTeamLineup: data.homeTeam?.lineup   ?? [],
    awayTeamLineup: data.awayTeam?.lineup   ?? [],
    homeFormation:  data.homeTeam?.formation ?? null,
    awayFormation:  data.awayTeam?.formation ?? null,
  };
}
