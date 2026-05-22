import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTeamDetail } from '../../../lib/football';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const team = await fetchTeamDetail(id);
    // Convocados e técnico mudam muito pouco — cache 1 hora
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(team);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    if (message === 'rate_limit') return res.status(429).json({ error: 'Rate limit atingido' });
    return res.status(500).json({ error: message });
  }
}
