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
    "revision": "ae0307b787d9f792725d1066d22914e1"
  },
  {
    "url": "about/index.html",
    "revision": "2cefa1a3ed7dd15602d93edf73be5934"
  },
  {
    "url": "blog/index.html",
    "revision": "064fcde71ee94060cef53ead6f83aca1"
  },
  {
    "url": "contact/index.html",
    "revision": "dbbc2d46a911a46462b41387d7c39826"
  },
  {
    "url": "services/index.html",
    "revision": "4776d3100c611f71978f9e38a3763b55"
  },
  {
    "url": "showcase/index.html",
    "revision": "45328f013801d8dce5956d7d3f3687e3"
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
    "revision": "344e428ed64427c2018c1684a2786e4a"
  },
  {
    "url": "api/contact/props.json",
    "revision": "a2e91cc238ff4ebc103f756babdb0205"
  },
  {
    "url": "api/services/props.json",
    "revision": "7f61b3c9af6ef2ee5200aa3bb4c72ca5"
  },
  {
    "url": "api/showcase/props.json",
    "revision": "cb6c18d9ad9f040b48dd82acdd922cfd"
  },
  {
    "url": "assets/js/app.min.js",
    "revision": "e995cf7c9643bb8b546e25e349cb4201"
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
