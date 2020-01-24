/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.setCacheNameDetails({prefix: "dbushell.com-v10.4.0"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "885c63d201c34b2348a918ec5555b32b"
  },
  {
    "url": "about/index.html",
    "revision": "d708dd3dc369c33b24c24dab960f1d68"
  },
  {
    "url": "blog/index.html",
    "revision": "abde683ab50676bd770f5c10fa3a0c95"
  },
  {
    "url": "contact/index.html",
    "revision": "50eb567742d33c3024b717d685374965"
  },
  {
    "url": "services/index.html",
    "revision": "d69657e07d720af7bc02586758ba48b5"
  },
  {
    "url": "showcase/index.html",
    "revision": "3f95eb2ad92b2212542f9f7634b00cac"
  },
  {
    "url": "api/props.json",
    "revision": "286cdec267f579fd2a34d45f5b2d6de4"
  },
  {
    "url": "api/about/props.json",
    "revision": "90b4ab09ad6232a1285f2d5a9c23b26d"
  },
  {
    "url": "api/blog/props.json",
    "revision": "7d5e6bcb7edb1509136faaffdf4e141a"
  },
  {
    "url": "api/contact/props.json",
    "revision": "a2e91cc238ff4ebc103f756babdb0205"
  },
  {
    "url": "api/services/props.json",
    "revision": "df61d67ab338437dcf71329a2f9244d3"
  },
  {
    "url": "api/showcase/props.json",
    "revision": "cb6c18d9ad9f040b48dd82acdd922cfd"
  },
  {
    "url": "assets/js/app.min.js",
    "revision": "9cbc878ae15192e91a223ea5211a7878"
  },
  {
    "url": "assets/img/offline.svg",
    "revision": "fddd736fa3a37ea922ad60a1fe5f6b99"
  },
  {
    "url": "assets/img/loading.svg",
    "revision": "7d72b4219f220e762623d1de955da99d"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.precaching.cleanupOutdatedCaches();
