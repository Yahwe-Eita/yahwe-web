const CACHE_NAME = "yahwe-eita-shell-v2";
const OFFLINE_URL = "/offline";
const SHELL_ASSETS = [OFFLINE_URL, "/splash-logo.png", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }
  const url = new URL(event.request.url);
  if (event.request.method === "GET" && url.origin === self.location.origin && SHELL_ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(url.pathname).then((cached) => cached || fetch(event.request)));
  }
});
