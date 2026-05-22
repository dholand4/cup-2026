const API_BASE    = 'https://api.football-data.org/v4';
const COMPETITION = 'WC'; // FIFA World Cup 2026

function headers() {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) throw new Error('FOOTBALL_API_KEY não configurada');
  return { 'X-Auth-Token': key };
}

async function fetchAllMatches(): Promise<any[]> {
  // Plano gratuito não permite filtros de status — busca todos de uma vez
  const url = `${API_BASE}/competitions/${COMPETITION}/matches`;
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
  const allMatches = await fetchAllMatches();

  const todayStr = new Date().toISOString().split('T')[0];
  const weekAgo  = new Date(Date.now() - 7 * 86_400_000).toISOString().split('T')[0];

  const live     = allMatches.filter((m: any) => ['IN_PLAY', 'PAUSED'].includes(m.status));
  const today    = allMatches.filter((m: any) => m.utcDate.startsWith(todayStr));
  const upcoming = allMatches.filter((m: any) => ['SCHEDULED', 'TIMED'].includes(m.status) && m.utcDate > todayStr);
  const recent   = allMatches.filter((m: any) => m.status === 'FINISHED' && m.utcDate.split('T')[0] >= weekAgo);

  return { live, today, upcoming, recent, hasLive: live.length > 0 };
}

export { fetchStandings };
