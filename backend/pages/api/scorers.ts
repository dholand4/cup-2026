import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchScorers } from '../../lib/football';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const scorers = await fetchScorers();
    // Artilheiros mudam só quando alguém marca gol — cache 15 minutos
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ scorers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    if (message === 'rate_limit') return res.status(429).json({ error: 'Rate limit atingido' });
    return res.status(500).json({ error: message });
  }
}
