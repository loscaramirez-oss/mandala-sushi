/* ============================================================
   Service Worker de Mandala Sushi: caché offline de la app.
   Al actualizar archivos, incrementa CACHE (ej. mandala-v2).
   ============================================================ */
const CACHE = "mandala-v1";
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "logo.png",
  "manifest.json",
  "mandala-card.png",
  "js/core/container.js",
  "js/core/observable.js",
  "js/config/brand-config.js",
  "js/models/cart-item.js",
  "js/data/menu-data.js",
  "js/repositories/storage-repository.js",
  "js/repositories/cart-repository.js",
  "js/repositories/loyalty-repository.js",
  "js/repositories/order-repository.js",
  "js/services/currency-service.js",
  "js/services/gradient-service.js",
  "js/services/catalog-service.js",
  "js/services/cart-service.js",
  "js/services/loyalty-service.js",
  "js/services/hours-service.js",
  "js/services/order-service.js",
  "js/services/checkout-service.js",
  "js/viewmodels/catalog-vm.js",
  "js/viewmodels/cart-vm.js",
  "js/viewmodels/loyalty-vm.js",
  "js/viewmodels/checkout-vm.js",
  "js/viewmodels/package-vm.js",
  "js/views/menu-view.js",
  "js/views/drawer-view.js",
  "js/views/checkout-view.js",
  "js/views/sheet-view.js",
  "js/views/app-view.js",
  "js/main.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === "basic") {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
