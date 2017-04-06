(function (win, doc) {

  var db = win.dbushell = { };
  var de = doc.getElementsByTagName('html')[0];
  var fs = doc.getElementsByTagName('script')[0];

  win.loadScript = function (src, callback) {
    var script = doc.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    if (callback) {
      script.onload = script.onreadystatechange = function() {
        if (/^($|loaded|complete)/.test(script.readyState || '')) {
          script.onload = script.onreadystatechange = null;
          callback();
        }
      };
    }
    fs.parentNode.insertBefore(script, fs);
  };

  de.className += ' wf-loading';
  var start = new Date().getTime();
  win.loadScript('//use.typekit.net/bgo5mvm.js', function () {
    if (!win.Typekit) return;
    try {
      win.Typekit.load();
      if ((new Date().getTime() - start) > 1000) {
        var i, tk, sheets = doc.getElementsByTagName('link');
        for (i = 0; i < sheets.length; i++) {
          if (sheets[i].rel === 'stylesheet' && sheets[i].href && sheets[i].href.indexOf('typekit.net') > -1) {
            tk = sheets[i];
            tk.media = 'only x';
            tk.onload = function () {
              tk.media = 'all';
            };
          }
        }
      }
    } catch(e) { };
  });

  win.addEventListener('DOMContentLoaded', function (e) {
    setTimeout(function () {
      de.className += ' js-anim';
    }, 300);
  });
  win.loadScript('/assets/js/main.min.js?v={{siteVer}}', function () {
    win.dbushell.init();
  });
})(window, document);
