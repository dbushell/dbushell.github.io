importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js'
);

workbox.setConfig({
  debug: false
});

workbox.core.setCacheNameDetails({
  prefix: 'dbushell',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

const daySeconds = days => days * 24 * 60 * 60;
const rVer = '\\?v=([\\d]+\\.[\\d]+\\.[\\d]+)';

workbox.precaching.precache([
  '/assets/img/offline.svg',
  '/api/props.json',
  '/api/about/props.json',
  '/api/blog/props.json',
  '/api/contact/props.json',
  '/api/services/props.json',
  '/api/showcase/props.json'
]);

const matchPreCache = url =>
  caches.match(url, {
    cacheName: 'dbushell-precache-v1'
  });

workbox.routing.registerRoute(
  new RegExp(`.js(${rVer})?$`),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'dbushell-js-v1',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(7),
        maxEntries: 10
      })
    ]
  })
);

const htmlStrategy = workbox.strategies.staleWhileRevalidate({
  cacheName: 'dbushell-html-v1',
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: daySeconds(7),
      maxEntries: 30
    })
  ]
});

workbox.routing.registerRoute(/\/([\w_-]+\/)*$/, context =>
  htmlStrategy.handle(context).catch(err => matchPreCache(context.url))
);

const jsonStrategy = workbox.strategies.staleWhileRevalidate({
  cacheName: 'dbushell-json-v1',
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: daySeconds(7),
      maxEntries: 30
    })
  ]
});

workbox.routing.registerRoute(new RegExp(`.json$`), context =>
  jsonStrategy.handle(context).catch(err => matchPreCache(context.url))
);

const imageStrategy = workbox.strategies.cacheFirst({
  cacheName: 'dbushell-images-v1',
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: daySeconds(30),
      maxEntries: 30
    })
  ]
});

workbox.routing.registerRoute(
  new RegExp(`\.(?:gif|jpeg|jpg|png|svg)(${rVer})?$`),
  context =>
    imageStrategy.handle(context).catch(err =>
      matchPreCache('/assets/img/offline.svg').then(response =>
        response.text().then(
          text =>
            new Response(text, {
              headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store'
              }
            })
        )
      )
    )
);

workbox.routing.registerRoute(
  new RegExp('https://unpkg.com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'dbushell-unpkg-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(30),
        maxEntries: 5
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://use.typekit.net/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'dbushell-typekit-v1',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(30),
        maxEntries: 10
      })
    ]
  })
);
