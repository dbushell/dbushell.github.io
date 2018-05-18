importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js'
);

workbox.setConfig({
  debug: false
});

const cacheNameParts = {
  prefix: 'dbushell',
  suffix: 'v4'
};

const getCacheName = name =>
  `${cacheNameParts.prefix}-${name}-${cacheNameParts.suffix}`;

workbox.core.setCacheNameDetails({
  prefix: cacheNameParts.prefix,
  suffix: cacheNameParts.suffix,
  precache: 'precache',
  runtime: 'runtime'
});

const daySeconds = days => days * 24 * 60 * 60;
const rVer = '\\?v=([\\d]+\\.[\\d]+\\.[\\d]+)';
const rName = new RegExp(getCacheName('[a-z]*?'));

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => !rName.test(name))
            .map(name => caches.delete(name))
        )
      )
  );
});

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
    cacheName: getCacheName('precache')
  });

workbox.routing.registerRoute(
  new RegExp('/(Pikaday|Nestable).*$'),
  workbox.strategies.networkOnly()
);

workbox.routing.registerRoute(
  new RegExp(`.js(${rVer})?$`),
  workbox.strategies.staleWhileRevalidate({
    cacheName: getCacheName('js'),
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(7),
        maxEntries: 10
      })
    ]
  })
);

const htmlStrategy = workbox.strategies.staleWhileRevalidate({
  cacheName: getCacheName('html'),
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
  cacheName: getCacheName('json'),
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
  cacheName: getCacheName('images'),
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
  new RegExp('https://(ajax|storage|fonts).(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: getCacheName('googleapis'),
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: daySeconds(30),
        maxEntries: 30
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://unpkg.com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: getCacheName('unpkg'),
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
