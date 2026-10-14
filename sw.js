// Guarda una copia de la página en el móvil para que funcione sin conexión.
// Al cambiar algo en la página, sube también este número (v1 → v2…).
const VERSION = "conjugador-v1";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon.png",
  "literata-latin-500-normal.woff2", "literata-latin-700-normal.woff2", "literata-latin-400-italic.woff2",
  "atkinson-hyperlegible-latin-400-normal.woff2", "atkinson-hyperlegible-latin-400-italic.woff2", "atkinson-hyperlegible-latin-700-normal.woff2"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primero la versión de Internet (si hay conexión); si no, la copia guardada.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
