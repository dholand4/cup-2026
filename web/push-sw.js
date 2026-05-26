// Arena Score — Push Notification Service Worker

self.addEventListener('push', event => {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch { data = { title: 'Arena Score', body: event.data.text() }; }

  const title   = data.title ?? 'Arena Score';
  const options = {
    body:    data.body   ?? '',
    icon:    data.icon   ?? '/pwa-icons/icon-192x192.png',
    badge:   '/pwa-icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data:    { url: data.url ?? '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(url));
});
