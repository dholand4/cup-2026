import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllMatches, MatchesPayload } from '../../lib/football';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MatchesPayload | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await getAllMatches();

    // Cache dinâmico: 30s com jogo ao vivo, 5min sem
    const maxAge = payload.hasLive ? 30 : 300;
    res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`);
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(payload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[matches]', message);

    if (message === 'rate_limit') {
      return res.status(429).json({ error: 'Rate limit atingido — tente em 1 minuto' });
    }
    return res.status(500).json({ error: message });
  }
}
