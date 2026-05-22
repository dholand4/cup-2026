import { IMatch, IStandingsResponse } from '../@types';
import { translateTeam } from '../utils/teamNames';

// ── URL base ──────────────────────────────────────────────────────────
// Em produção aponta para o backend na Vercel.
// Em dev, se não houver BACKEND_URL, cai direto na football-data.org.

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? '';
const DIRECT_BASE = 'https://api.football-data.org/v4';
const DIRECT_KEY  = process.env.EXPO_PUBLIC_FOOTBALL_API_KEY ?? '';

function translateMatch(m: IMatch): IMatch {
  return {
    ...m,
    homeTeam: translateTeam(m.homeTeam),
    awayTeam: translateTeam(m.awayTeam),
  };
}

// ── Via backend Vercel (produção) ─────────────────────────────────────

export interface AllMatchesPayload {
  live:     IMatch[];
  today:    IMatch[];
  upcoming: IMatch[];
  recent:   IMatch[];
  hasLive:  boolean;
}

export async function getAllMatchesFromBackend(): Promise<AllMatchesPayload> {
  const res = await fetch(`${BACKEND_URL}/api/matches`);
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  const data = await res.json();
  return {
    live:     (data.live     ?? []).map(translateMatch),
    today:    (data.today    ?? []).map(translateMatch),
    upcoming: (data.upcoming ?? []).map(translateMatch),
    recent:   (data.recent   ?? []).map(translateMatch),
    hasLive:  data.hasLive ?? false,
  };
}

export async function getStandingsFromBackend(): Promise<IStandingsResponse> {
  const res = await fetch(`${BACKEND_URL}/api/standings`);
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  const data = await res.json();
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

// ── Via football-data.org direto (dev / fallback) ─────────────────────

const DIRECT_HEADERS = { 'X-Auth-Token': DIRECT_KEY };

async function directFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${DIRECT_BASE}${path}`, { headers: DIRECT_HEADERS });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function getAllMatchesDirect(): Promise<AllMatchesPayload> {
  const today   = new Date().toISOString().split('T')[0];
  const last7   = new Date(Date.now() - 7  * 86_400_000).toISOString().split('T')[0];
  const next30  = new Date(Date.now() + 30 * 86_400_000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

  const [liveRaw, todayRaw, upcomingRaw, recentRaw] = await Promise.all([
    directFetch<any>('/competitions/WC/matches?status=IN_PLAY,PAUSED'),
    directFetch<any>(`/competitions/WC/matches?dateFrom=${today}&dateTo=${today}`),
    directFetch<any>(`/competitions/WC/matches?status=SCHEDULED,TIMED&dateFrom=${tomorrow}&dateTo=${next30}`),
    directFetch<any>(`/competitions/WC/matches?status=FINISHED&dateFrom=${last7}&dateTo=${today}`),
  ]);

  const live     = (liveRaw.matches     ?? []).map(translateMatch);
  const todayM   = (todayRaw.matches    ?? []).map(translateMatch);
  const upcoming = (upcomingRaw.matches ?? []).map(translateMatch);
  const recent   = (recentRaw.matches   ?? []).map(translateMatch);

  return { live, today: todayM, upcoming, recent, hasLive: live.length > 0 };
}

export async function getStandingsDirect(): Promise<IStandingsResponse> {
  const raw = await directFetch<IStandingsResponse>('/competitions/WC/standings');
  return {
    standings: raw.standings.map((group: any) => ({
      ...group,
      table: group.table.map((row: any) => ({
        ...row,
        team: translateTeam(row.team),
      })),
    })),
  };
}

// ── Exports unificados (usa backend se configurado, senão direto) ──────

export async function getAllMatches(): Promise<AllMatchesPayload> {
  if (BACKEND_URL) return getAllMatchesFromBackend();
  return getAllMatchesDirect();
}

export async function getStandings(): Promise<IStandingsResponse> {
  if (BACKEND_URL) return getStandingsFromBackend();
  return getStandingsDirect();
}
