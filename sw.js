const CACHE = "mvs-editor-de-pdf-v45-paper-safe";
const ASSETS = [
  "./","./?pwa=v45","./index.html","./style.css","./theme-v38.css","./fix-v40.css","./fix-v41.css","./fix-v42.css","./fix-v43.css","./fix-v44.css","./fix-v45.css","./app.js","./manifest.webmanifest","./browserconfig.xml",
  "./icons/brand-ui-light-v37.png","./icons/brand-ui-dark-v37.png",
  "./icons/favicon-v37-64.png",
  "./icons/mvs-app-v37-192.png","./icons/mvs-app-v37-512.png","./icons/mvs-app-v37-maskable-512.png",
  "./icons/mvs-apple-touch-v37-180.png","./icons/mvs-windows-tile-v37-150.png",
  "./assets/mvs-cover.png","./assets/mvs-letterhead.png","./assets/gdv-cover.png","./assets/gdv-letterhead.png"
];
const CORE = new Set(["index.html","style.css","app.js","manifest.webmanifest"]);
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const name = url.pathname.split("/").pop() || "index.html";
  if(e.request.mode === "navigate" || CORE.has(name)){
    e.respondWith(fetch(e.request).then(async res => { const cache=await caches.open(CACHE); cache.put(e.request,res.clone()); return res; }).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(async res=>{const cache=await caches.open(CACHE);cache.put(e.request,res.clone());return res;}).catch(()=>caches.match("./index.html"))));
});
