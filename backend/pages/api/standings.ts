import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchStandings } from '../../lib/football';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const standings = await fetchStandings();

    // Standings mudam pouco — cache de 5 minutos
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ standings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[standings]', message);

    if (message === 'rate_limit') {
      return res.status(429).json({ error: 'Rate limit atingido — tente em 1 minuto' });
    }
    return res.status(500).json({ error: message });
  }
}
