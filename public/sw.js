// HayatLink Service Worker — Emergency Polling + Offline PWA
const CACHE_NAME      = 'hayatlink-v7';
const STATIC_CACHE    = 'hayatlink-static-v7';
const API_CACHE       = 'hayatlink-api-v7';
const PAGES_CACHE     = 'hayatlink-pages-v7';

const PRECACHE_ASSETS = ['/', '/manifest.json', '/icon-192x192.png', '/icon-512x512.png', '/logo.png'];

// ─── Emergency polling state (lives in SW scope) ───────────────
const shownEmergencyIds = new Set();
let pollingTimer = null;

// ─── Install ───────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache =>
      cache.addAll(PRECACHE_ASSETS).catch(() => {})
    )
  );
});

// ─── Activate ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (![CACHE_NAME, STATIC_CACHE, API_CACHE, PAGES_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch (cache strategy) ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension') || url.pathname.endsWith('.apk')) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(API_CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || new Response(JSON.stringify({ offline: true }), {
            headers: { 'Content-Type': 'application/json' }, status: 200
          });
        })
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then(c => c.put(request, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(PAGES_CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          const dash = await caches.match('/dashboard');
          if (dash) return dash;
          const home = await caches.match('/');
          if (home) return home;
          return new Response(
            `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>وضع عدم الاتصال | HayatLink</title>
            <style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center}.card{background:#1e293b;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:36px 24px;max-width:380px;width:100%}.icon{font-size:48px;margin-bottom:16px}h1{margin:0 0 8px;font-size:20px}p{color:#94a3b8;font-size:13px;line-height:1.6;margin:0 0 24px}.btn{display:block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 24px;border-radius:14px;font-weight:700;font-size:14px;width:100%;box-sizing:border-box;cursor:pointer;border:none}</style>
            </head><body><div class="card"><div class="icon">📡</div><h1>أنت في وضع عدم الاتصال</h1><p>بياناتك محفوظة. اضغط للدخول إلى لوحة التحكم بدون إنترنت.</p><button class="btn" onclick="location.href='/dashboard'">الذهاب إلى لوحة التحكم</button></div></body></html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request)
        .then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then(c => c.put(request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ══════════════════════════════════════════════════════════════
// 🚨 EMERGENCY NOTIFICATION ENGINE
// Polls /api/notifications from the SERVICE WORKER (background)
// Shows native system notifications with vibration on Android
// ══════════════════════════════════════════════════════════════

async function checkEmergencies() {
  try {
    const res = await fetch('/api/notifications', {
      credentials: 'include',
      cache: 'no-store',
      headers: { 'X-Requested-By': 'sw' }
    });
    if (!res.ok) return;

    const data = await res.json();
    const emergencies = (data.notifications || []).filter(
      n => n.type === 'EMERGENCY_REQUEST' && !n.isRead
    );

    for (const notif of emergencies) {
      if (shownEmergencyIds.has(notif.id)) continue;
      shownEmergencyIds.add(notif.id);

      // Show native phone notification with vibration
      await self.registration.showNotification(
        notif.title || '🚨 نداء طوارئ عاجل!',
        {
          body: notif.message || 'مستشفى بحاجة ماسة لمتبرعين — حضورك ينقذ حياة! 🩸',
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          // Vibration pattern: long-short-long-short-very-long (feels urgent)
          vibrate: [500, 150, 500, 150, 800, 150, 800],
          tag: `emergency-${notif.id}`,
          renotify: true,          // always vibrate + sound even for same tag
          requireInteraction: true, // stays on screen until user acts
          silent: false,
          data: {
            url: '/dashboard/emergency',
            notifId: notif.id
          },
          actions: [
            { action: 'donate', title: '🩸 التبرع الآن' },
            { action: 'dismiss', title: 'إغلاق' }
          ]
        }
      );

      // Also notify all open clients (tabs/WebView) to update UI
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({
          type: 'EMERGENCY_ALERT',
          title: notif.title,
          message: notif.message,
          notifId: notif.id
        });
      }
    }
  } catch (_) {
    // Network unavailable — silent fail, will retry next interval
  }
}

// Start recurring polling every 30 seconds
function startPolling() {
  if (pollingTimer) clearInterval(pollingTimer);
  checkEmergencies(); // immediate first check
  pollingTimer = setInterval(checkEmergencies, 30000);
}

// ─── Message handler — client sends START_EMERGENCY_POLLING ───
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'START_EMERGENCY_POLLING') {
    startPolling();
    event.source?.postMessage({ type: 'POLLING_STARTED' });
  }

  if (event.data.type === 'STOP_EMERGENCY_POLLING') {
    if (pollingTimer) { clearInterval(pollingTimer); pollingTimer = null; }
  }

  // Client can also trigger an immediate check
  if (event.data.type === 'CHECK_NOW') {
    checkEmergencies();
  }
});

// ─── Periodic Background Sync (Chrome Android 80+) ───────────
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'emergency-check') {
    event.waitUntil(checkEmergencies());
  }
});

// ─── Web Push (if VAPID configured in future) ─────────────────
self.addEventListener('push', (event) => {
  let data = {
    title: '🚨 نداء طوارئ — HayatLink',
    body: 'حضورك ينقذ حياة! انقر للتفاصيل.',
    url: '/dashboard/emergency'
  };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (_) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [500, 150, 500, 150, 800],
      tag: 'push-emergency',
      renotify: true,
      requireInteraction: true,
      data: { url: data.url },
      actions: [
        { action: 'donate', title: '🩸 التبرع الآن' },
        { action: 'dismiss', title: 'إغلاق' }
      ]
    })
  );
});

// ─── Notification click ────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/dashboard/emergency';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Focus existing tab if open
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open new tab/window
      if (self.clients.openWindow) return self.clients.openWindow(urlToOpen);
    })
  );
});
