// DONNER.X Advanced Service Worker for Offline PWA Mode
const CACHE_NAME = 'donner-v3';
const STATIC_CACHE = 'donner-static-v3';
const API_CACHE = 'donner-api-v3';
const PAGES_CACHE = 'donner-pages-v3';

// Core assets to pre-cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/qr',
  '/dashboard/donations',
  '/dashboard/gamification',
  '/dashboard/profile',
  '/dashboard/profile/certificates',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache completed with some non-critical misses:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME, STATIC_CACHE, API_CACHE, PAGES_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extensions
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 1. API Calls (e.g. /api/donor/me) -> Network-First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          return new Response(JSON.stringify({ offline: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          });
        })
    );
    return;
  }

  // 2. Next.js Static Chunks, Images, Fonts -> Cache-First with Network Fallback
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);
      })
    );
    return;
  }

  // 3. Page Navigations (HTML documents) -> Network-First with Cache Fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // 1. Try exact cached page
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          // 2. Try dashboard cached page
          const cachedDashboard = await caches.match('/dashboard');
          if (cachedDashboard) return cachedDashboard;

          // 3. Try cached home page
          const cachedHome = await caches.match('/');
          if (cachedHome) return cachedHome;

          // 4. Fallback offline HTML
          return new Response(
            `<!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <title>وضع عدم الاتصال | DONNER.X</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
                .card { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px 24px; max-width: 380px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .icon { width: 64px; height: 64px; border-radius: 16px; background: rgba(220,38,38,0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px; }
                h1 { font-size: 20px; font-weight: 800; margin: 0 0 8px; }
                p { font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px; }
                .btn { display: inline-block; background: #dc2626; color: white; text-decoration: none; padding: 12px 24px; border-radius: 14px; font-weight: bold; font-size: 14px; border: none; cursor: pointer; transition: all 0.2s; width: 100%; box-sizing: border-box; }
                .btn:active { transform: scale(0.98); }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="icon">📡</div>
                <h1>أنت في وضع عدم الاتصال</h1>
                <p>بياناتك وبطاقتك الصحية وسجل تبرعاتك محفوظة في جهازك. اضغط على الزر أدناه للدخول إلى لوحة التحكم والتصفح بدون إنترنت.</p>
                <button class="btn" onclick="window.location.href='/dashboard'">الذهاب إلى لوحة التحكم</button>
              </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 4. Default -> Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
