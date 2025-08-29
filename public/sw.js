const CACHE_NAME = 'dengenleague-v1'
const STATIC_ASSETS = [
  '/',
  '/team',
  '/battle',
  '/profile',
  '/game',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('fetch', (event) => {
  // Cache API responses for offline access
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone())
            return response
          })
          .catch(() => {
            return cache.match(event.request)
          })
      })
    )
  } else {
    // Serve static assets from cache
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    )
  }
})