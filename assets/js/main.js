/*!
 * Copyright (c) David Bushell | @dbushell | http://dbushell.com
 */
if (/dbushell\.com/.test(window.location.hostname)) {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-9497100-1']);
  _gaq.push(['_setDomainName', 'dbushell.com']);
  _gaq.push(['_trackPageview']);
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
}

window.dbushell = (function (window, document) {
  var _init = 0;
  var app = window.dbushell || { };

  function getData(el, attr) {
    return el ? (el.dataset ? el.dataset[attr] : el.getAttribute('data-' + attr)) : null;
  }

  function setData(el, attr, value) {
    return el ? (el.dataset ? (el.dataset[attr] = value) : el.setAttribute('data-' + attr, value)) : null;
  }

  function sortBy(arr, attr) {
    return arr.sort(function (a, b) {
      var ap = parseInt(getData(a, attr) || 100, 10);
      var bp = parseInt(getData(b, attr) || 100, 10);
      return ap - bp;
    });
  }

  app.iscroll = function () {
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
    var resize = function () {
      var position = window.getComputedStyle($footer, null).getPropertyValue('position');
      if (position === 'fixed') {
        scroller.enable();
      } else {
        scroller.disable();
      }
    };
    window.addEventListener('resize', resize, false);
    setTimeout(resize, 0);
  };

  app.nav = function () {
    if (!_init || !document.querySelector || !document.documentElement.classList) {
      return;
    }
    var $nav = document.querySelector('.nav');
    var $navList = $nav ? $nav.querySelector('.nav__list[data-root]') : null;
    if (!$navList) {
      return;
    }
    var $navItems;
    var $navMoreItem = $navList.querySelector('.nav__item--more');
    var $navMoreList = $navMoreItem.querySelector('.nav__list');

    if (window.Headroom) {
      var headroom = new window.Headroom($nav, {offset: 35});
      headroom.init();
    }

    var navListStyle = window.getComputedStyle($navList, null);
    var navListPadding = parseInt(navListStyle.paddingLeft, 10) + parseInt(navListStyle.paddingRight, 10);

    $navMoreItem.children[0].addEventListener('click', function (e) {
      e.preventDefault();
      if ($navMoreList.classList.contains('nav__dropdown--active')) {
        $navMoreList.classList.remove('nav__dropdown--active');
        $navMoreList.classList.remove('nav__dropdown--hover');
      } else {
        $navMoreList.classList.add('nav__dropdown--active');
      }
    }, false);

    $navMoreItem.addEventListener('mouseenter', function () {
      $navMoreList.classList.add('nav__dropdown--hover');
    }, false);

    $navMoreItem.addEventListener('mouseleave', function () {
      $navMoreList.classList.remove('nav__dropdown--hover');
    }, false);

    var updateLoop = 0;
    function update() {
      if (updateLoop++ < 50) {
        // reset
        $navMoreList.classList.remove('nav__dropdown--active');
        $navMoreList.classList.remove('nav__dropdown--hover');
        $nav.classList.remove('nav--flex');
        // $nav.offsetWidth;

        // update selector of visible nav items
        $navItems = [].slice.call($nav.querySelectorAll('.nav__list[data-root] > .nav__item:not(.nav__item--more)'));
        sortBy($navItems, 'priority');

        // calc current widths
        $navMoreItem.style.display = 'block';
        var moreWidth = $navMoreItem.offsetWidth;
        var freeWidth = 0;
        var navWidth = 0;

        $navItems.forEach(function ($item) {
          navWidth += $item.offsetWidth;
        });

        freeWidth = ($navList.offsetWidth - navListPadding) - moreWidth;

        // reduce until all items are on one line
        if (navWidth > freeWidth) {
          var $last = $navItems[$navItems.length - 1];
          // $last.dataset.width = $last.offsetWidth;
          setData($last, 'width', $last.offsetWidth);
          // prepend last item to the overflow list
          if ($navMoreList.children.length > 0) {
            $navMoreList.insertBefore($last, $navMoreList.children[0]);
          } else {
            $navMoreList.appendChild($last);
          }
          return update();
        }
        // add overflow items back into menu
        if ($navMoreList.children.length > 0) {
          var $first = $navMoreList.children[0];
          // if ($navMoreList.children.length === 1) {
          // }
          // move the first item back into the main list if space is free
          if (navWidth + parseInt(getData($first, 'width'), 10) < freeWidth) {
            $navItems.push($first);
            sortBy($navItems, 'order');
            $navItems.forEach(function ($item) {
              $navList.appendChild($item);
            });
            $navList.appendChild($navMoreItem);
            // $navList.insertBefore($first, $navMoreItem);
            return update();
          }
        }

        $nav.classList.add('nav--flex');
      } else {
        // should never reach here...
      }
      updateLoop = 0;
      // update more list visiblity
      $navMoreItem.style.display = $navMoreList.children.length ? 'block' : 'none';
    }

    window.addEventListener('load', update, false);
    window.addEventListener('resize', update, false);
    window.addEventListener('orientationchange', update, false);
  };

  app.init = function () {
    if (_init++) {
      return;
    }
    window.loadScript('/assets/js/vendor/headroom.min.js', function () {
      window.dbushell.nav();
    });
    // use iScroll5 for scrollbar design in Firefox and IE9+
    if (app.isFF || (app.isIE && !app.isOldIE)) {
      window.loadScript('/assets/js/vendor/iscroll.min.js', function () {
        window.dbushell.iscroll();
      });
    }
    window.loadScript('/assets/js/vendor/fitvids.js');
    // fix SVG sprites in IE
    if (app.isIE) {
      window.loadScript('/assets/js/vendor/svgxuse.min.js');
    }
    return app;
  };

  return app;
})(window, window.document);

//     var doc = $(document.documentElement);

//     var grid = false,
//         $gridEl = $("<div class='grid'> \
//     <div class='grid__s grid__s--6'> \
//         <div class='grid__c grid__c--1'></div> \
//         <div class='grid__c grid__c--2'></div> \
//         <div class='grid__c grid__c--3'></div> \
//         <div class='grid__c grid__c--4'></div> \
//         <div class='grid__c grid__c--5'></div> \
//         <div class='grid__c grid__c--6'></div> \
//     </div> \
// </div> \
// <div class='grid'> \
//     <div class='grid__s grid__s--9'> \
//         <div class='grid__c grid__c--1'></div> \
//         <div class='grid__c grid__c--2'></div> \
//         <div class='grid__c grid__c--3'></div> \
//         <div class='grid__c grid__c--4'></div> \
//         <div class='grid__c grid__c--5'></div> \
//         <div class='grid__c grid__c--6'></div> \
//         <div class='grid__c grid__c--7'></div> \
//         <div class='grid__c grid__c--8'></div> \
//         <div class='grid__c grid__c--9'></div> \
//     </div> \
// </div>");

//     var $baselineEl = $('<link rel="stylesheet" href="http://basehold.it/14/ff0000">');

//     var addGrid = function()
//     {
//         grid = true;
//         $('main').append($gridEl);
//         $('head').append($baselineEl);
//     };

//     var removeGrid = function()
//     {
//         grid = false;
//         $gridEl.remove();
//         $baselineEl.remove();
//     };

//     $win.on('keydown', function(e)
//     {

//         if ((e.which || e.keyCode) === 71) {
//             if (grid) {
//                 removeGrid();
//             } else {
//                 addGrid();
//             }
//             $docEl.toggleClass('js--grid');
//         }
//     });
