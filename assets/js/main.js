/*!
 * Copyright (c) David Bushell | @dbushell | http://dbushell.com
 */
// if (/dbushell\.com/.test(window.location.hostname)) {
//   (function(i, s, o, g, r, a, m) {
//     i['GoogleAnalyticsObject'] = r;
//     (i[r] =
//       i[r] ||
//       function() {
//         (i[r].q = i[r].q || []).push(arguments);
//       }), (i[r].l = 1 * new Date());
//     (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
//     a.async = 1;
//     a.src = g;
//     m.parentNode.insertBefore(a, m);
//   })(
//     window,
//     document,
//     'script',
//     'https://www.google-analytics.com/analytics.js',
//     'ga'
//   );
//   ga('create', 'UA-9497100-1', 'auto');
//   ga('send', 'pageview');
// }

window.dbushell = (function(window, document) {
  var _init = 0;
  var app = window.dbushell || {};

  function sortBy(arr, attr) {
    return arr.sort(function(a, b) {
      var ap = parseInt(a.dataset[attr] || 100, 10);
      var bp = parseInt(b.dataset[attr] || 100, 10);
      return ap - bp;
    });
  }

  var ua = navigator.userAgent;
  app.isFF = /firefox/i.test(ua);
  app.isIE = Boolean(window.ActiveXObject || window.navigator.msPointerEnabled);
  // app.isAndroid = Boolean(ua.match(/Android/) && ua.match(/AppleWebKit/) && !ua.match(/Chrome/));
  // app.isIOS = /(iPhone|iPad|iPod)/gi.test(ua);

  var footerUpdate;

  app.iscroll = function() {
    if (!window.IScroll || !_init) {
      return;
    }
    var $footer = document.getElementById('footer');
    $footer.style.overflow = 'hidden';
    var scroller = new window.IScroll($footer, {
      mouseWheel: true,
      scrollbars: true,
      disableMouse: true,
      interactiveScrollbars: true,
      fadeScrollbars: true
    });
    footerUpdate = function() {
      var position = window
        .getComputedStyle($footer, null)
        .getPropertyValue('position');
      if (position === 'fixed') {
        scroller.enable();
      } else {
        scroller.disable();
      }
    };
    window.addEventListener('resize', footerUpdate);
    setTimeout(footerUpdate, 0);
  };

  var $nav, $navList, $navMore, $navDropdown, navListStyle, navListPadding;
  var navDropdownActiveClass = 'b-nav__dropdown--active';
  var navDropdownHoverClass = 'b-nav__dropdown--hover';

  function navUpdate(recursed) {
    recursed = parseInt(recursed, 10) || 0;
    if (recursed === 0) {
      $nav = document.querySelector('.b-nav');
      $navList = $nav.querySelector('.b-nav__list');
      $navMore = $nav.querySelector('.b-nav__more');
      $navDropdown = $nav.querySelector('.b-nav__dropdown');
      navListStyle = window.getComputedStyle($navList, null);
      navListPadding =
        parseInt(navListStyle.paddingLeft, 10) +
        parseInt(navListStyle.paddingRight, 10);
      $navDropdown.classList.remove(navDropdownActiveClass);
      $navDropdown.classList.remove(navDropdownHoverClass);
      $nav.classList.remove('b-nav--not-overflow');
      $nav.classList.remove('b-nav--overflow');
    }
    if (++recursed > 50) {
      return console.log('navUpdate recursion error');
    }
    $nav.classList.add('b-nav--min');

    // Get and sort visible nav items
    var $navItems = [].slice.call($navList.querySelectorAll('.b-nav__item'));
    sortBy($navItems, 'priority');

    var freeWidth = $navList.offsetWidth - navListPadding;
    var navWidth = $navItems.reduce(function(width, $item) {
      return width + $item.offsetWidth;
    }, 0);

    // Reduce until all items are on one line
    if (navWidth > freeWidth) {
      var $last = $navItems[$navItems.length - 1];
      $last.dataset.width = $last.offsetWidth;
      // Prepend last item to the overflow list
      if ($navDropdown.childNodes.length > 0) {
        $navDropdown.insertBefore($last, $navDropdown.childNodes[0]);
      } else {
        $navDropdown.appendChild($last);
      }
      return navUpdate(recursed);
    }
    // Add overflow items back into menu
    if ($navDropdown.childNodes.length > 0) {
      var $first = $navDropdown.childNodes[0];
      // Move the first item back into the main list if space is free
      if (navWidth + parseInt($first.dataset.width, 10) < freeWidth) {
        $navItems.push($first);
        sortBy($navItems, 'order');
        $navItems.forEach(function($item) {
          $navList.appendChild($item);
        });
        // $navList.appendChild($navMore);
        return navUpdate(recursed);
      }
    }

    $nav.classList.remove('b-nav--min');

    // Update more list visiblity
    if ($navDropdown.childNodes.length) {
      $nav.classList.add('b-nav--overflow');
      $navMore.style.display = 'block';
    } else {
      $nav.classList.add('b-nav--not-overflow');
      $navMore.style.display = 'none';
    }
  }

  app.headroom = function() {
    if (!window.Headroom) {
      return;
    }
    var headroom = new window.Headroom($nav, {
      offset: 35,
      classes: {
        initial: 'b-nav',
        pinned: 'b-nav--pinned',
        unpinned: 'b-nav--unpinned',
        top: 'b-nav--top',
        notTop: 'b-nav--not-top',
        bottom: 'b-nav--bottom',
        notBottom: 'b-nav--not-bottom'
      }
    });
    headroom.init();
  };

  app.nav = function() {
    document.documentElement.classList.add('js-nav');

    navUpdate();

    $navMore.childNodes[0].addEventListener(
      'click',
      function(e) {
        e.preventDefault();
        if ($navDropdown.classList.contains(navDropdownActiveClass)) {
          $navDropdown.classList.remove(navDropdownActiveClass);
          $navDropdown.classList.remove(navDropdownHoverClass);
        } else {
          $navDropdown.classList.add(navDropdownActiveClass);
        }
      },
      false
    );

    $navMore.addEventListener(
      'mouseenter',
      function() {
        $navDropdown.classList.add(navDropdownHoverClass);
      },
      false
    );

    $navMore.addEventListener(
      'mouseleave',
      function() {
        $navDropdown.classList.remove(navDropdownHoverClass);
      },
      false
    );

    window.addEventListener('load', navUpdate);
    window.addEventListener('resize', navUpdate);
    window.addEventListener('orientationchange', navUpdate);
  };

  app.video = function() {
    if (!document.querySelector('iframe')) {
      return;
    }
    if (window.fitVids) {
      window.fitVids();
    } else {
      window.loadScript('/assets/js/vendor/fitvids.min.js?v=' + app.ver);
    }
  };

  app.refresh = function(hard) {
    if (hard && $nav) {
      app.headroom();
      window.removeEventListener('load', navUpdate);
      window.removeEventListener('resize', navUpdate);
      window.removeEventListener('orientationchange', navUpdate);
      app.nav();
    }
    if (hard && footerUpdate) {
      window.removeEventListener('resize', footerUpdate);
      app.iscroll();
    }
    app.video();
    window.dispatchEvent(new Event('resize'));
  };

  app.init = function() {
    if (
      _init++ ||
      !document.querySelector ||
      !document.documentElement.classList
    ) {
      return;
    }
    window.dbushell.nav();
    window.loadScript(
      '/assets/js/vendor/headroom.min.js?v=' + app.ver,
      function() {
        window.dbushell.headroom();
      }
    );
    // Use iScroll5 for scrollbar design in Firefox and IE9+
    if (app.isFF || app.isIE) {
      window.loadScript(
        '/assets/js/vendor/iscroll.min.js?v=' + app.ver,
        function() {
          window.dbushell.iscroll();
        }
      );
    }
    // Fix SVG sprites in IE
    if (app.isIE) {
      window.loadScript('/assets/js/vendor/svgxuse.min.js?v=' + app.ver);
    }
    if (/dbushell/.test(window.location.href) && 'serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js');
      });
    }
    if ('fetch' in window) {
      app.universal = function() {
        window.loadScript('/assets/js/app.min.js?v=' + app.ver);
      };
    }
    // Responsive video
    window.dbushell.video();
  };

  return app;
})(window, window.document);
