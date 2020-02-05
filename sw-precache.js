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
    "revision": "04b714eb93caaa54e410fda9df328940"
  },
  {
    "url": "about/index.html",
    "revision": "cc74601d4c68bf7babfe17ff38f7ea21"
  },
  {
    "url": "blog/index.html",
    "revision": "4880a110b666a70d1f559d766c9db459"
  },
  {
    "url": "contact/index.html",
    "revision": "75adf0e4646ac016e78f9abe2adf052c"
  },
  {
    "url": "services/index.html",
    "revision": "e9046086846bd2831f7c2da633aa466c"
  },
  {
    "url": "showcase/index.html",
    "revision": "fcdd1e63f9c6376df2b9f6cdd1e63418"
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
    "revision": "51228ea324b7cd2b59755deb2186fb76"
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
    "revision": "dbeaa713a02d6babee0076962d77b60f"
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
