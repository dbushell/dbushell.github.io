importScripts('sw-precache.js');

const prefix = workbox.core.cacheNames.prefix;

workbox.routing.registerRoute(
  /\/(Pikaday|Nestable).*$/,
  new workbox.strategies.NetworkOnly(),
  'GET'
);

workbox.routing.registerRoute(
  /.js(\?v=([\d]+\.[\d]+\.[\d]+))?$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${prefix}-js`,
    plugins: [
      new workbox.expiration.Plugin({
        purgeOnQuotaError: true,
        maxAgeSeconds: 604800,
        maxEntries: 10
      })
    ]
  }),
  'GET'
);

workbox.routing.registerRoute(
  /\/([\w_-]+\/)*$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${prefix}-html`,
    plugins: [
      new workbox.expiration.Plugin({
        purgeOnQuotaError: true,
        maxAgeSeconds: 604800,
        maxEntries: 20
      })
    ]
  }),
  'GET'
);

workbox.routing.registerRoute(
  /.json$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${prefix}-json`,
    plugins: [
      new workbox.expiration.Plugin({
        purgeOnQuotaError: true,
        maxAgeSeconds: 604800,
        maxEntries: 20
      })
    ]
  }),
  'GET'
);

workbox.routing.registerRoute(
  /.(?:gif|jpeg|jpg|png|svg)(\?v=([\d]+\.[\d]+\.[\d]+))?$/,
  new workbox.strategies.CacheFirst({
    cacheName: `${prefix}-img`,
    plugins: [
      new workbox.expiration.Plugin({
        purgeOnQuotaError: true,
        maxAgeSeconds: 2592000,
        maxEntries: 20
      })
    ]
  }),
  'GET'
);

workbox.routing.registerRoute(
  /https:\/\/(.*?).?(googleapis|gstatic|unpkg).com\/(.*)/,
  new workbox.strategies.CacheFirst({
    cacheName: `${prefix}-cdn`,
    plugins: [
      new workbox.cacheableResponse.Plugin({statuses: [0, 200]}),
      new workbox.expiration.Plugin({
        purgeOnQuotaError: true,
        maxAgeSeconds: 2592000,
        maxEntries: 10
      })
    ]
  }),
  'GET'
);

workbox.routing.setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'image':
      return caches.match(
        workbox.precaching.getCacheKeyForURL('assets/img/offline.svg')
      );
      break;
    default:
      return Response.error();
  }
});
