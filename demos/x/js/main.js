/*!
 *
 *  Copyright (c) David Bushell | http://dbushell.com/
 *
 */
(function(window, document, undefined)
{

    // helper functions

    var trim = function(str)
        {
            return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
        },

        hasClass = function(el, cn)
        {
            return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
        },

        addClass = function(el, cn)
        {
            if (!hasClass(el, cn)) {
                el.className = (el.className === '') ? cn : el.className + ' ' + cn;
            }
        },

        removeClass = function(el, cn)
        {
            el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
        };


    // normalize vendor prefixes

    var transform_prop = window.Modernizr.prefixed('transform'),
        transition_prop = window.Modernizr.prefixed('transition'),
        transition_end = (function() {
            var props = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            return props.hasOwnProperty(transition_prop) ? props[transition_prop] : false;
        })();

    var doc = document.documentElement;

    window.App = (function()
    {

        var _init = false, app = { };

        app.init = function()
        {
            if (_init) {
                return;
            }
            _init = true;

            if (!transition_end) {
                return;
            }

            var canvas = document.getElementById('canvas'),

                nav_open = false,
                nav_class = 'js-nav';

            var closeNavEnd = function(e)
            {
                if (e && e.target === canvas) {
                    document.removeEventListener(transition_end, closeNavEnd, false);
                }
                nav_open = false;
            };

            app.closeNav =function()
            {
                if (nav_open) {
                    // close navigation after transition or immediately
                    var duration = parseFloat(window.getComputedStyle(canvas, '')[transition_prop + 'Duration']);
                    if (duration > 0) {
                        document.addEventListener(transition_end, closeNavEnd, false);
                    } else {
                        closeNavEnd(null);
                    }
                }
                removeClass(doc, nav_class);
            };

            app.openNav = function()
            {
                if (nav_open) {
                    return;
                }
                addClass(doc, nav_class);
                nav_open = true;
            };

            app.toggleNav = function(e)
            {
                if (nav_open && hasClass(doc, nav_class)) {
                    app.closeNav();
                } else {
                    app.openNav();
                }
                if (e) {
                    e.preventDefault();
                }
            };

            // open nav with main "nav" button
            document.getElementById('nav-open-btn').addEventListener('click', app.toggleNav, false);

            // close nav with main "close" button
            document.getElementById('nav-close-btn').addEventListener('click', app.toggleNav, false);

            // close nav by touching the partial off-screen content
            document.addEventListener('click', function(e)
            {
                if (!nav_open || !e.target) {
                    return;
                }
                var parent = e.target;
                do
                {
                    if (parent.id === 'nav') {
                        break;
                    }
                    if (parent.nodeType === 9) {
                        app.closeNav();
                        e.preventDefault();
                        break;
                    }
                }
                while((parent = parent.parentNode));
            },
            true);

            addClass(doc, 'js-ready');

        };

        return app;

    })();

    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', window.App.init, false);
    }

})(window, window.document);
