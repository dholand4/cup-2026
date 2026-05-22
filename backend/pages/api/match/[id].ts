import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMatchDetail } from '../../../lib/football';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const match = await fetchMatchDetail(id);
    // Cache dinâmico: 30s ao vivo, 5min encerrado
    const isLive = ['IN_PLAY', 'PAUSED'].includes(match.status);
    const maxAge = isLive ? 30 : 300;
    res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(match);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    if (message === 'rate_limit') return res.status(429).json({ error: 'Rate limit atingido' });
    return res.status(500).json({ error: message });
  }
}
