import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription, userId } = req.body;
  if (!subscription || !userId) return res.status(400).json({ error: 'Missing fields' });

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({ usuario_id: userId, subscription }, { onConflict: 'usuario_id' });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
