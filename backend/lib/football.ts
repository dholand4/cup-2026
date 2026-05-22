const API_BASE   = 'https://api.football-data.org/v4';
const COMPETITION = 'WC'; // FIFA World Cup 2026

function headers() {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) throw new Error('FOOTBALL_API_KEY não configurada');
  return { 'X-Auth-Token': key };
}

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

async function fetchMatches(params: string): Promise<any[]> {
  const url = `${API_BASE}/competitions/${COMPETITION}/matches?${params}`;
  const res  = await fetch(url, { headers: headers() });
  if (!res.ok) {
    if (res.status === 429) throw new Error('rate_limit');
    throw new Error(`football-data error ${res.status}`);
  }
  const data = await res.json();
  return data.matches ?? [];
}

async function fetchStandings(): Promise<any[]> {
  const url = `${API_BASE}/competitions/${COMPETITION}/standings`;
  const res  = await fetch(url, { headers: headers() });
  if (!res.ok) {
    if (res.status === 429) throw new Error('rate_limit');
    throw new Error(`football-data error ${res.status}`);
  }
  const data = await res.json();
  return data.standings ?? [];
}

export interface MatchesPayload {
  live:     any[];
  today:    any[];
  upcoming: any[];
  recent:   any[];
  hasLive:  boolean;
}

export async function getAllMatches(): Promise<MatchesPayload> {
  const todayStr   = dateOffset(0);
  const weekAgo    = dateOffset(-7);
  const in30days   = dateOffset(30);
  const tomorrow   = dateOffset(1);

  const [live, today, upcoming, recent] = await Promise.all([
    fetchMatches('status=IN_PLAY,PAUSED'),
    fetchMatches(`dateFrom=${todayStr}&dateTo=${todayStr}`),
    fetchMatches(`dateFrom=${tomorrow}&dateTo=${in30days}&status=SCHEDULED,TIMED`),
    fetchMatches(`dateFrom=${weekAgo}&dateTo=${todayStr}&status=FINISHED`),
  ]);

  return { live, today, upcoming, recent, hasLive: live.length > 0 };
}

export { fetchStandings };
