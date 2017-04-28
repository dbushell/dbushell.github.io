'use strict';

/*! dbushell.com */

const cacheName = 'dbushell-SkXsglZJ-';
const cacheWhitelist = [cacheName];
const cacheURLs = [];

// Cache global
cacheURLs.push(
  '/offline/',
  '/assets/js/main.min.js?v=9.0.7',
  '/assets/js/vendor/headroom.min.js?v=9.0.7',
  '/assets/img/dbushell-for-hire.svg',
  '/assets/img/me3@1x.jpg',
  '/assets/img/me3@2x.jpg'
);

// Cache common pages
cacheURLs.push(
  '/',
  '/about/',
  '/blog/',
  '/contact/',
  '/services/',
  '/showcase/',
  '/assets/img/origami-crane-bg.svg',
  '/assets/img/origami-crane.png',
  '/assets/img/david-bushell.svg',
  '/assets/img/starburst.svg',
  '/assets/img/stars.svg'
);

// Ignore URLs matches
const cacheIgnore = [
  /^\/Pikaday\//i,
  /^\/Nestable\//i,
  /^\/browser-sync\//i
];

// Accept URLs matches
const cacheAccept = [
  /\/[\w_-]+\/$/,
  /\.(js|json)$/,
  /\.(jpeg|jpg|png|svg)$/
];

const offlineImage = `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
  <style>
    .st0{fill:#fff}.st1{fill:#1d97bf}.st2{fill:#494b4d;font-family:"Helvetica Neue",Arial,sans-serif;font-size:20px;}
  </style>
  <path class="st0" d="M0 0h400v225H0z"/>
  <g transform="matrix(2 0 0 2 176 40)">
    <path class="st0" d="M16.557 1H7.443L1 7.443v9.113L7.443 23h9.113L23 16.557V7.443L16.557 1z"/>
    <path class="st1" d="M16.143 2L22 7.858v8.284L16.143 22H7.857L2 16.142V7.858L7.857 2h8.286zm.828-2H7.029L0 7.029v9.941L7.029 24h9.941L24 16.971V7.029L16.971 0z"/>
    <path class="st1" d="M10.5 6h3l-1 8h-1z"/>
    <circle class="st1" cx="12" cy="17" r="1.25"/>
  </g>
  <text class="st2" x="200" y="150" text-anchor="middle" alignment-baseline="central" transform="translate(0 -28)">
    <tspan x="200" dy="0">Image failed to load due</tspan> <tspan x="200" dy="28">to connectivity issues,</tspan> <tspan x="200" dy="28">are you offline?</tspan>
  </text>
</svg>`;

function updateCache() {
  return caches.open(cacheName)
    .then(cache => cache.addAll(cacheURLs));
}

function clearCache() {
  return caches.keys().then(cacheNames => Promise.all(
    cacheNames.map(name => cacheWhitelist.includes(name) ?
      Promise.resolve() : caches.delete(name))
    ));
}

self.addEventListener('install', event => {
  event.waitUntil(updateCache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(clearCache().then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response;
      }
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const ignore = cacheIgnore.filter(r => r.test(url.pathname));
        if (ignore.length > 0) {
          return response;
        }
        const accept = cacheAccept.filter(r => r.test(url.pathname));
        if (accept.length < 1) {
          return response;
        }
        return caches.open(cacheName).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      }).catch(() => {
        if (!url.pathname.match(/\.[a-z]+$/)) {
          return caches.match('/offline/');
        }
        if (url.pathname.match(/\.(jpeg|jpg|png|svg)$/)) {
          return new Response(offlineImage, {
            headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store'}
          });
        }
      });
    })
  );
});
