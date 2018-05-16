(function(win, doc) {
  // cut the mustard
  if (!'querySelector' in doc) return;

  // setup global
  var app = {
    ver: '{{siteVer}}',
    isDev: !/dbushell\.com/.test(win.location.hostname),
    isReact: 'fetch' in win,
    isWorker: 'serviceWorker' in navigator,
    isFF: /firefox/i.test(navigator.userAgent),
    isIE: Boolean(win.ActiveXObject || win.navigator.msPointerEnabled)
  };

  // load service worker
  if (app.isWorker) {
    win.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js');
    });
  }

  // selectors
  var $html = doc.documentElement;
  var $head = doc.querySelector('head');

  app.load = function(src, callback) {
    var script = doc.createElement('script');
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

  $html.className += ' wf-loading';
  var start = new Date().getTime();
  app.load('https://use.typekit.net/bgo5mvm.js', function() {
    if (!win.Typekit) return;
    try {
      win.Typekit.load();
      if (new Date().getTime() - start > 1000) {
        var sheets = doc.getElementsByTagName('link');
        for (var tk, i = 0; i < sheets.length; i++) {
          if (
            sheets[i].rel === 'stylesheet' &&
            sheets[i].href &&
            sheets[i].href.indexOf('typekit.net') > -1
          ) {
            tk = sheets[i];
            tk.media = 'only x';
            tk.onload = function() {
              tk.media = 'all';
            };
          }
        }
      }
    } catch (e) {}
  });

  win.addEventListener('DOMContentLoaded', function() {
    if (app.isIE) {
      app.load('/assets/js/vendor/svgxuse.min.js?v=' + app.ver);
    }
  });

  var suffix = app.isDev ? 'development' : 'production.min';
  var dependencies = [
    'https://unpkg.com/react@16.3.2/umd/react.' + suffix + '.js',
    'https://unpkg.com/react-dom@16.3.2/umd/react-dom.' + suffix + '.js',
    '/assets/js/app.min.js?v=' + app.ver
  ];

  if (app.isReact) {
    function loadDependency() {
      if (dependencies.length) {
        app.load(dependencies.shift(), loadDependency);
      } else {
        win.dbushell.boot();
      }
    }
    loadDependency();
  }

  win.dbushell = app;
})(window, document);
