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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Proteção simples por chave secreta
  const authHeader = req.headers['x-admin-key'];
  if (authHeader !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, body, icon, userId } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  const payload = JSON.stringify({ title, body, icon: icon ?? '/pwa-icons/icon-192x192.png' });

  // Busca todas as subscrições (ou filtra por userId se fornecido)
  let query = supabase.from('push_subscriptions').select('subscription');
  if (userId) query = query.eq('usuario_id', userId);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(200).json({ sent: 0 });

  const results = await Promise.allSettled(
    data.map(row => webpush.sendNotification(row.subscription, payload)),
  );

  const sent   = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return res.status(200).json({ sent, failed });
}
