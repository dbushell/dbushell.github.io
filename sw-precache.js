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

workbox.core.setCacheNameDetails({prefix: "dbushell.com-v10.4.1"});

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
    "revision": "39622ae3e24c1692c03fba7d97728329"
  },
  {
    "url": "about/index.html",
    "revision": "44fbd47b806a7812956924adbe5dbd13"
  },
  {
    "url": "blog/index.html",
    "revision": "ce93e8f0ac40872de959432f184993d5"
  },
  {
    "url": "contact/index.html",
    "revision": "003b63be90e07efb4f97fb197565a884"
  },
  {
    "url": "services/index.html",
    "revision": "45be376ed40b43a6c50c7e6174db5709"
  },
  {
    "url": "showcase/index.html",
    "revision": "3dbeaa9389b2fd03a01b0b66d29590a6"
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
    "revision": "2b74a4df262e480e910fbc1f46b1a115"
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
    "revision": "22f34a884bcb5d02d3c15b2149ba2024"
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
