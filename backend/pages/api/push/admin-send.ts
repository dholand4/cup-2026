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

// E-mails com permissão de admin
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase());

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Valida JWT do usuário via Supabase
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token required' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  // Verifica se é admin
  const email = user.email?.toLowerCase() ?? '';
  if (!ADMIN_EMAILS.includes(email)) return res.status(403).json({ error: 'Forbidden' });

  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });

  // Busca todas as subscriptions
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('subscription');

  if (!subs || subs.length === 0) return res.status(200).json({ sent: 0 });

  const payload = JSON.stringify({ title, body, icon: '/pwa-icons/icon-192x192.png' });

  const results = await Promise.allSettled(
    subs.map(s => webpush.sendNotification(s.subscription, payload, {
      contentEncoding: 'aesgcm',
    })),
  );

  const sent   = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return res.status(200).json({ sent, failed });
}
