const CACHE = "mvs-editor-de-pdf-v22";
const ASSETS = [
  "./","./index.html","./style.css","./app.js","./manifest.webmanifest",
  "./icons/favicon.ico","./icons/favicon.svg",
  "./icons/icon-16.png","./icons/icon-32.png","./icons/icon-48.png","./icons/icon-72.png",
  "./icons/icon-96.png","./icons/icon-128.png","./icons/icon-144.png",
  "./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-256.png",
  "./icons/icon-384.png","./icons/icon-512.png","./icons/maskable-512.png"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => { if (e.request.method !== "GET") return; e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match("./index.html")))); });
