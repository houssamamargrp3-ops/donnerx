self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('donner-store').then((cache) => cache.addAll([
      '/',
      '/dashboard',
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
