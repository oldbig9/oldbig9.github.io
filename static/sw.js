// PWA Service Worker - 运行时缓存策略
// 无网时优先访问过的资源(工具页、JS、CSS、图)可离线访问
const CACHE_VERSION = 'v1';
const STATIC_CACHE = 'static-' + CACHE_VERSION;
const PAGE_CACHE = 'pages-' + CACHE_VERSION;

// 预缓存:SW 安装时立即缓存的核心资源(无 hash 的固定文件)
const PRECACHE_URLS = [
  '/manifest.webmanifest',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/favicon-32x32.png',
  '/favicon.ico',
];

// 静态资源扩展名(走 cache-first)
const STATIC_ASSET_RE = /\.(?:js|css|png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|eot)(\?|$)/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // 立即激活,不等旧 SW 释放
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 拦截 fetch
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 只处理同源 GET 请求
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 工具页 HTML:network-first(更新优先,断网回退缓存)
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/offline/')))
    );
    return;
  }

  // 静态资源(JS/CSS/图,带 fingerprint 不可变):cache-first
  if (STATIC_ASSET_RE.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 其它同源 GET:stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// 接收 skipWaiting 消息(更新时立即接管)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
