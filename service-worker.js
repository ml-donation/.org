const CACHE_NAME='ml-donations-pwa-v3';
const APP_SHELL=['./','./index.html','./member.html','./admin.html','./admin/','./admin/index.html','./manifest.webmanifest','./pwa-install.js','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const req=event.request; const url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin) return;
 if(req.mode==='navigate'){
   event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
 } else {
   event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));}return res;})));
 }
});