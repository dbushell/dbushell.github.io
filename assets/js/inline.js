(function(window, document) {
  // cut the mustard
  if (!'querySelector' in document) return;

  // setup global
  var app = {
    ver: '{{siteVer}}',
    isDev: !/dbushell\.com/.test(window.location.hostname),
    isReact: 'fetch' in window,
    isLazy: 'IntersectionObserver' in window,
    isWorker: 'serviceWorker' in navigator,
    isFF: /firefox/i.test(navigator.userAgent),
    isIE: Boolean(window.ActiveXObject || window.navigator.msPointerEnabled)
  };

  // load service worker
  if (app.isWorker) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  // selectors
  var $html = document.documentElement;
  var $head = document.querySelector('head');

  app.load = function(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    if (callback) {
      script.onload = script.onreadystatechange = function() {
        if (/^($|loaded|complete)/.test(script.readyState || '')) {
          script.onload = script.onreadystatechange = null;
          callback(src);
        }
      };
    }
    $head.appendChild(script);
  };

  window.WebFontConfig = {
    google: {
      families: ['Noto+Sans:400,400i,70', 'Quicksand:500']
    }
  };

  app.load('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

  var unpkgEnv = app.isDev ? 'development' : 'production.min';
  var dependencies = [
    'https://unpkg.com/react@16.3.2/umd/react.' + unpkgEnv + '.js',
    'https://unpkg.com/react-dom@16.3.2/umd/react-dom.' + unpkgEnv + '.js',
    '/assets/js/app' + (app.isDev ? '' : '.min') + '.js?v=' + app.ver
  ];

  window.addEventListener('DOMContentLoaded', function() {
    if (app.isReact) {
      if (app.isLoaded) {
        window.dbushell.boot();
      } else {
        app.isReady = true;
      }
    } else {
      document
        .querySelectorAll('img[data-lazy="false"]')
        .forEach(function(img) {
          img.src = img.dataset.src;
        });
    }
    if (app.isIE) {
      app.load('/assets/js/vendor/svgxuse.min.js?v=' + app.ver);
    }
  });

  if (app.isReact) {
    function loadDependency() {
      if (dependencies.length) {
        app.load(dependencies.shift(), loadDependency);
      } else {
        if (app.isReady) {
          window.dbushell.boot();
        } else {
          app.isLoaded = true;
        }
      }
    }
    loadDependency();
  }

  window.dbushell = app;
})(window, document);
