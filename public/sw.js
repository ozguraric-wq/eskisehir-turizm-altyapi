// Sites only: keep installation assets available without caching visitor data.
// The GitHub Pages export replaces this file with its existing offline app shell.
const CACHE = "etahb-install-assets-v1";
const ASSETS = ["brand/app-192.png", "brand/app-512.png", "manifest.webmanifest"]
  .map(path => new URL(path, self.registration.scope).href);

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("etahb-install-assets-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  // Navigation, API requests and session responses always use the network.
  if (event.request.method !== "GET" || !ASSETS.includes(event.request.url)) return;
  event.respondWith((async () => {
    try { return await fetch(event.request); }
    catch { return await caches.match(event.request) || Response.error(); }
  })());
});
