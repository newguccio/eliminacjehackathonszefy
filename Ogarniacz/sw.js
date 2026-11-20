// Wspólna pamięć przeglądarki może też zawierać inne aplikacje pod tym adresem.
const scope = self.registration.scope;
const prefix = "ogarniacz:" + scope + ":";
const cacheName = prefix + "v2";
const files = ["index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "icon-maskable.png"];
const assets = new Set(files.map(path => new URL(path, scope).href));

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll([...assets]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(prefix) && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  url.search = "";
  const index = new URL("index.html", scope).href;
  const key = url.href === scope ? index : url.href;
  if (!assets.has(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        try { await cache.put(key, response.clone()); } catch { /* Pamięć może być pełna. */ }
      }
      return response;
    } catch (error) {
      const saved = await cache.match(key);
      if (saved) return saved;
      throw error;
    }
  })());
});
