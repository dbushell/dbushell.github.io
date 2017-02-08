/*!
 * Copyright (c) David Bushell | @dbushell | http://dbushell.com
 */
if (/dbushell\.com/.test(window.location.hostname))
{
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

(function(window, document, undefined)
{

  // var hasEventListeners = !!window.addEventListener,

    // addEvent = function(el, e, callback, capture)
    // {
    //   if (hasEventListeners) {
    //     el.addEventListener(e, callback, !!capture);
    //   } else {
    //     el.attachEvent('on' + e, callback);
    //   }
    // },

    // removeEvent = function(el, e, callback, capture)
    // {
    //   if (hasEventListeners) {
    //     el.removeEventListener(e, callback, !!capture);
    //   } else {
    //     el.detachEvent('on' + e, callback);
    //   }
    // },

    // fireEvent = function(el, eventName, data)
    // {
    //   var ev;

    //   if (document.createEvent) {
    //     ev = document.createEvent('HTMLEvents');
    //     ev.initEvent(eventName, true, false);
    //     ev = extend(ev, data);
    //     el.dispatchEvent(ev);
    //   } else if (document.createEventObject) {
    //     ev = document.createEventObject();
    //     ev = extend(ev, data);
    //     el.fireEvent('on' + eventName, ev);
    //   }
    // },

    // trim = function(str)
    // {
    //   return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    // },

    // hasClass = function(el, cn)
    // {
    //   return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    // },

    // addClass = function(el, cn)
    // {
    //   if (!hasClass(el, cn)) {
    //     el.className = (el.className === '') ? cn : el.className + ' ' + cn;
    //   }
    // },

    // removeClass = function(el, cn)
    // {
    //   el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    // };


  // var console = window.console;
  // if (typeof console !== 'object' || !console.log)
  // {
  //   (function() {
  //     var noop    = function() {},
  //       methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
  //       length  = methods.length;
  //     console = {};
  //     while (length--) {
  //       console[methods[length]] = noop;
  //     }
  //   }());
  // }

  // https://github.com/jashkenas/underscore/blob/master/underscore.js

  var _now = Date.now || function() { return new Date().getTime(); };

  var _throttle = function(func, wait, options)
  {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (typeof options !== 'object') {
      options = { };
    }
    var later = function() {
      previous = options.leading === false ? 0 : _now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
      } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  window.dbushell = (function()
  {

    var _init = 0, app = window.dbushell || { };

    var $win   = window,
        $docEl = document.documentElement;

    var _scrollers = [ ];

    // use iScroll5 for scrollbar design in Firefox and IE9+
    if (app.isFF || (app.isIE && !app.isOldIE)) {
      window.loadScript('/assets/js/vendor/iscroll.min.js', function() {
        window.dbushell.iscroll();
      });
    }

    app.iscroll = function()
    {
      if (!window.IScroll || !_init) {
        return;
      }
      var $footer = document.getElementById('footer');
      $footer.style.overflow = 'hidden';

      var options = {
        mouseWheel            : true,
        scrollbars            : true,
        disableMouse          : true,
        interactiveScrollbars : true,
        fadeScrollbars        : true
      };

      var scroller = new window.IScroll($footer, options);
      _scrollers.push(scroller);

      var resize = function()
      {
        var position = window.getComputedStyle($footer, null).getPropertyValue('position');
        if (position === 'fixed') {
          scroller.enable();
        } else {
          scroller.disable();
        }
      };
      setTimeout(resize, 0);

      // addEvent(window, 'resize', _throttle(resize, 300), false);
      window.addEventListener('resize', _throttle(resize, 300), false);
    };

    app.nav = function()
    {
      if (!$docEl.querySelector || !$docEl.classList) return;

      var $nav = $docEl.querySelector('.nav'),
          $navList = $nav.querySelector('.nav__list[data-root]');

      if (!$navList) return;

      var $navItems,
          $navMoreItem = $navList.querySelector('.nav__item--more'),
          $navMoreList = $navMoreItem.querySelector('.nav__list');

      var headroom  = new Headroom($nav, { offset: 35 });
      headroom.init();

      var navListStyle = window.getComputedStyle($navList, null),
          navListPadding = parseInt(navListStyle.paddingLeft, 10) + parseInt(navListStyle.paddingRight, 10);

      $navMoreItem.children[0].addEventListener('click', function(e) {
        e.preventDefault();
        if ($navMoreList.classList.contains('nav__dropdown--active')) {
          $navMoreList.classList.remove('nav__dropdown--active');
          $navMoreList.classList.remove('nav__dropdown--hover');
        } else {
          $navMoreList.classList.add('nav__dropdown--active');
        }
      }, false);

      $navMoreItem.addEventListener('mouseenter', function(e) {
        $navMoreList.classList.add('nav__dropdown--hover');
      }, false);

      $navMoreItem.addEventListener('mouseleave', function(e) {
        $navMoreList.classList.remove('nav__dropdown--hover');
      }, false);

      function getData(el, attr)
      {
        return el ? ( el.dataset ? el.dataset[attr] : el.getAttribute('data-' + attr) ) : null;
      }

      function setData(el, attr, value)
      {
        return el ? ( el.dataset ? el.dataset[attr] = value : el.setAttribute('data-' + attr, value) ) : null;
      }

      function sortBy(arr, attr)
      {
        return arr.sort(function(a, b) {
          var ap = parseInt(getData(a, attr) || 100),
              bp = parseInt(getData(b, attr) || 100);
          return ap - bp;
        });
      }

      var updateLoop = 0;
      function update()
      {
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
          var more_width = $navMoreItem.offsetWidth,
              free_width = 0,
              nav_width = 0;

          $navItems.forEach(function($item) {
            nav_width += $item.offsetWidth;
          });

          free_width = ($navList.offsetWidth - navListPadding) - more_width;

          // reduce until all items are on one line
          if (nav_width > free_width) {
            var $last = $navItems[$navItems.length - 1];
            // $last.dataset.width = $last.offsetWidth;
            setData($last, 'width', $last.offsetWidth);

            // prepend last item to the overflow list
            if ($navMoreList.children.length) {
              $navMoreList.insertBefore($last, $navMoreList.children[0]);
            } else {
              $navMoreList.appendChild($last);
            }
            return update();

          } else {
            // add overflow items back into menu
            if ($navMoreList.children.length) {
              var $first = $navMoreList.children[0];
              if ($navMoreList.children.length === 1) {
              }
              // move the first item back into the main list if space is free
              if (nav_width + parseInt(getData($first, 'width'), 10) < free_width) {
                $navItems.push($first);
                sortBy($navItems, 'order');
                $navItems.forEach(function($item) {
                  $navList.appendChild($item);
                });
                $navList.appendChild($navMoreItem);
                // $navList.insertBefore($first, $navMoreItem);
                return update();
              }
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

      // var resizeTimeout = null;
      // function onResize()
      // {
      //   clearTimeout(resizeTimeout);
      //   resizeTimeout = setTimeout(function() {
      //   update();
      //   }, 50);
      // }

      window.addEventListener('load', _throttle(update, 50), false);
      window.addEventListener('resize', _throttle(update, 50), false);
      window.addEventListener('orientationchange', _throttle(update, 50), false);
    },

    app.init = function()
    {
      if (_init++) {
        return;
      }

      app.nav();

      app.iscroll();

      if (app.isIE) {
        loadScript('/assets/js/vendor/svgxuse.min.js');
      }

      return app;
    };

    return app;

  })();

})(window, window.document);

/*!
 * headroom.js v0.7.0 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2014 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */

!function(a,b){"use strict";function c(a){this.callback=a,this.ticking=!1}function d(b){return b&&"undefined"!=typeof a&&(b===a||b.nodeType)}function e(a){if(arguments.length<=0)throw new Error("Missing arguments in extend function");var b,c,f=a||{};for(c=1;c<arguments.length;c++){var g=arguments[c]||{};for(b in g)f[b]="object"!=typeof f[b]||d(f[b])?f[b]||g[b]:e(f[b],g[b])}return f}function f(a){return a===Object(a)?a:{down:a,up:a}}function g(a,b){b=e(b,g.options),this.lastKnownScrollY=0,this.elem=a,this.debouncer=new c(this.update.bind(this)),this.tolerance=f(b.tolerance),this.classes=b.classes,this.offset=b.offset,this.scroller=b.scroller,this.initialised=!1,this.onPin=b.onPin,this.onUnpin=b.onUnpin,this.onTop=b.onTop,this.onNotTop=b.onNotTop}var h={bind:!!function(){}.bind,classList:"classList"in b.documentElement,rAF:!!(a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame)};a.requestAnimationFrame=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame,c.prototype={constructor:c,update:function(){this.callback&&this.callback(),this.ticking=!1},requestTick:function(){this.ticking||(requestAnimationFrame(this.rafCallback||(this.rafCallback=this.update.bind(this))),this.ticking=!0)},handleEvent:function(){this.requestTick()}},g.prototype={constructor:g,init:function(){return g.cutsTheMustard?(this.elem.classList.add(this.classes.initial),setTimeout(this.attachEvent.bind(this),100),this):void 0},destroy:function(){var a=this.classes;this.initialised=!1,this.elem.classList.remove(a.unpinned,a.pinned,a.top,a.initial),this.scroller.removeEventListener("scroll",this.debouncer,!1)},attachEvent:function(){this.initialised||(this.lastKnownScrollY=this.getScrollY(),this.initialised=!0,this.scroller.addEventListener("scroll",this.debouncer,!1),this.debouncer.handleEvent())},unpin:function(){var a=this.elem.classList,b=this.classes;(a.contains(b.pinned)||!a.contains(b.unpinned))&&(a.add(b.unpinned),a.remove(b.pinned),this.onUnpin&&this.onUnpin.call(this))},pin:function(){var a=this.elem.classList,b=this.classes;a.contains(b.unpinned)&&(a.remove(b.unpinned),a.add(b.pinned),this.onPin&&this.onPin.call(this))},top:function(){var a=this.elem.classList,b=this.classes;a.contains(b.top)||(a.add(b.top),a.remove(b.notTop),this.onTop&&this.onTop.call(this))},notTop:function(){var a=this.elem.classList,b=this.classes;a.contains(b.notTop)||(a.add(b.notTop),a.remove(b.top),this.onNotTop&&this.onNotTop.call(this))},getScrollY:function(){return void 0!==this.scroller.pageYOffset?this.scroller.pageYOffset:void 0!==this.scroller.scrollTop?this.scroller.scrollTop:(b.documentElement||b.body.parentNode||b.body).scrollTop},getViewportHeight:function(){return a.innerHeight||b.documentElement.clientHeight||b.body.clientHeight},getDocumentHeight:function(){var a=b.body,c=b.documentElement;return Math.max(a.scrollHeight,c.scrollHeight,a.offsetHeight,c.offsetHeight,a.clientHeight,c.clientHeight)},getElementHeight:function(a){return Math.max(a.scrollHeight,a.offsetHeight,a.clientHeight)},getScrollerHeight:function(){return this.scroller===a||this.scroller===b.body?this.getDocumentHeight():this.getElementHeight(this.scroller)},isOutOfBounds:function(a){var b=0>a,c=a+this.getViewportHeight()>this.getScrollerHeight();return b||c},toleranceExceeded:function(a,b){return Math.abs(a-this.lastKnownScrollY)>=this.tolerance[b]},shouldUnpin:function(a,b){var c=a>this.lastKnownScrollY,d=a>=this.offset;return c&&d&&b},shouldPin:function(a,b){var c=a<this.lastKnownScrollY,d=a<=this.offset;return c&&b||d},update:function(){var a=this.getScrollY(),b=a>this.lastKnownScrollY?"down":"up",c=this.toleranceExceeded(a,b);this.isOutOfBounds(a)||(a<=this.offset?this.top():this.notTop(),this.shouldUnpin(a,c)?this.unpin():this.shouldPin(a,c)&&this.pin(),this.lastKnownScrollY=a)}},g.options={tolerance:{up:0,down:0},offset:0,scroller:a,classes:{pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top",initial:"headroom"}},g.cutsTheMustard="undefined"!=typeof h&&h.rAF&&h.bind&&h.classList,a.Headroom=g}(window,document);

/*!
 * based on FitVids | https://github.com/davatron5000/FitVids.js
 */

(function(window, document, undefined) {

  if (!document.querySelectorAll || !Array.prototype.forEach) return;

  var videos = [ ],
    selectors = [
    'iframe[src*="player.vimeo.com"]',
    'iframe[src*="youtube.com"]',
    'iframe[src*="youtube-nocookie.com"]',
    'iframe[src*="kickstarter.com"][src*="video.html"]',
    'object',
    'embed'
  ];

  selectors.forEach(function(selector, i) {
    var el = document.querySelectorAll(selector);
    if (el.length) {
      Array.prototype.push.apply(videos, Array.prototype.slice.call(el) );
    }
  });

  if (!videos.length) return;

  if(!document.getElementById('fit-vids-style')) {
    // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
    var head = document.head || document.getElementsByTagName('head')[0];
    var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
    var div = document.createElement('div');
    div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
    head.appendChild(div.childNodes[1]);
  }

  videos.forEach(function(video, i) {

    var parent = video.parentNode,
      wrapper,
      height,
      width,
      ratio;

    if (video.tagName.toLowerCase() === 'embed' && parent.tagName.toLowerCase() === 'object') return;
    if (parent.className.indexOf('fluid-width-video-wrapper') > -1) return;

    // if (isNaN(video.getAttribute('height')) || isNaN(video.getAttribute('width'))) {
    //     video.setAttribute('height', 9);
    //     video.setAttribute('width', 16);
    // }

    height = parseInt(video.getAttribute('height'), 10);
    width = parseInt(video.getAttribute('width'), 10);

    if (isNaN(height) || isNaN(width)) {
      height = 9;
      width = 16;
    }

    ratio = height / width;

    wrapper = document.createElement('div');
    wrapper.className = 'fluid-width-video-wrapper';
    wrapper.setAttribute('style', 'padding-top: ' + (ratio * 100) + '%');

    parent.insertBefore(wrapper, video);
    wrapper.appendChild(video);

    video.removeAttribute('height');
    video.removeAttribute('width');

  });

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
