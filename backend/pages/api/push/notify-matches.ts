import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  'mailto:contato@arenascore.app',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const BACKEND = 'https://copa2026-backend.vercel.app';

interface MatchSnap {
  id: number;
  status: string;
  homeTeam: { tla: string; shortName: string; name: string };
  awayTeam: { tla: string; shortName: string; name: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

function label(m: MatchSnap) {
  const h = m.homeTeam.shortName || m.homeTeam.name || m.homeTeam.tla;
  const a = m.awayTeam.shortName || m.awayTeam.name || m.awayTeam.tla;
  return `${h} x ${a}`;
}

async function sendToSubscribers(
  title: string,
  body: string,
  match: MatchSnap,
) {
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('subscription, notify_all, notify_favorites, favorites');

  if (!subs || subs.length === 0) return;

  const eligible = subs.filter(s => {
    if (s.notify_all) return true;
    if (s.notify_favorites) {
      const favs: string[] = s.favorites ?? [];
      return favs.includes(match.homeTeam.tla) || favs.includes(match.awayTeam.tla);
    }
    return false;
  });

  const payload = JSON.stringify({ title, body });

  await Promise.allSettled(
    eligible.map(s => webpush.sendNotification(s.subscription, payload, {
      contentEncoding: 'aesgcm',
    })),
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Permite GET (cron Vercel) e POST
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

  // Busca partidas ao vivo + de hoje
  const data = await fetch(`${BACKEND}/api/matches`).then(r => r.json()).catch(() => null);
  if (!data) return res.status(500).json({ error: 'Failed to fetch matches' });

  const matches: MatchSnap[] = [
    ...(data.live     ?? []),
    ...(data.today    ?? []),
    ...(data.recent   ?? []),
    ...(data.knockout ?? []),
  ];

  // Deduplica
  const matchMap = new Map<number, MatchSnap>();
  matches.forEach(m => matchMap.set(m.id, m));
  const uniqueMatches = [...matchMap.values()];

  if (uniqueMatches.length === 0) return res.status(200).json({ checked: 0 });

  // Lê cache de status anterior
  const { data: cached } = await supabase
    .from('match_status_cache')
    .select('match_id, status, home_score, away_score');

  const cacheMap = new Map<number, { status: string; home_score: number | null; away_score: number | null }>();
  (cached ?? []).forEach((c: any) => cacheMap.set(c.match_id, c));

  const notifications: Promise<void>[] = [];
  const upserts: any[] = [];

  for (const match of uniqueMatches) {
    const prev   = cacheMap.get(match.id);
    const curr   = match.status;
    const homeScore = match.score?.fullTime?.home ?? null;
    const awayScore = match.score?.fullTime?.away ?? null;

    upserts.push({
      match_id:   match.id,
      status:     curr,
      home_score: homeScore,
      away_score: awayScore,
      updated_at: new Date().toISOString(),
    });

    if (!prev) continue; // primeiro registro, sem notificação

    const prevStatus = prev.status;
    if (prevStatus === curr) continue; // sem mudança

    const lbl = label(match);

    // Jogo começou
    if ((prevStatus === 'SCHEDULED' || prevStatus === 'TIMED') && curr === 'IN_PLAY') {
      notifications.push(sendToSubscribers('Jogo Comecou!', lbl, match));
    }
    // Intervalo
    else if (prevStatus === 'IN_PLAY' && curr === 'PAUSED') {
      notifications.push(sendToSubscribers('Intervalo', lbl, match));
    }
    // Encerrado
    else if ((prevStatus === 'IN_PLAY' || prevStatus === 'PAUSED') && curr === 'FINISHED') {
      const scoreStr = homeScore != null
        ? `${match.homeTeam.tla} ${homeScore} x ${awayScore} ${match.awayTeam.tla}`
        : lbl;
      notifications.push(sendToSubscribers('Encerrado!', scoreStr, match));
    }
  }

  // Atualiza cache e envia notificações em paralelo
  await Promise.all([
    supabase.from('match_status_cache').upsert(upserts, { onConflict: 'match_id' }),
    ...notifications,
  ]);

  return res.status(200).json({ checked: uniqueMatches.length, notified: notifications.length });
}
