(function(window, document) {
  var $html = document.documentElement;
  var $head = document.querySelector('head');

  $html.classList.remove('no-js');
  $html.classList.add('js');

  // Cut the mustard
  if (!'querySelector' in document) {
    return;
  }

  // Setup global
  var app = {
    ver: '{{siteVer}}',
    isDev: !/dbushell/.test(window.location.hostname),
    isReact: 'fetch' in window,
    isLazy: 'IntersectionObserver' in window,
    isWorker: 'serviceWorker' in navigator
  };

  // Load service worker
  if (app.isWorker) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  // Async load script with callback
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

  // Setup dependencies to load in order
  var dependencies = [
    '/assets/js/app' + (app.isDev ? '' : '.min') + '.js?v=' + app.ver
  ];

  try {
    if (!document.createElement('link').relList.supports('preload')) {
      throw new Error();
    }
  } catch (err) {
    dependencies.unshift('/assets/js/vendor/cssrelpreload.js');
  }

  if (app.isDev) {
    dependencies.unshift(
      'https://unpkg.com/react/umd/react.development.js',
      'https://unpkg.com/react-dom/umd/react-dom.development.js'
    );
  }

  // Load dependencies
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

  window.addEventListener('DOMContentLoaded', function() {
    // Load lazy images and quit
    if (!app.isReact) {
      var images = [].slice.call(
        document.querySelectorAll('img[data-lazy="false"]')
      );
      for (var i = 0; i < images.length; i++) {
        images[i].src = images[i].dataset.src;
      }
      return;
    }
    // Load dependencies and boot universal app
    loadDependency();
    if (app.isLoaded) {
      window.dbushell.boot();
    } else {
      app.isReady = true;
    }
  });

  window.dbushell = app;
})(window, document);
