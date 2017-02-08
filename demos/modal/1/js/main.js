/*!
 *
 *  Copyright © David Bushell | http://dbushell.com/
 *
 */
(function(window, document, undefined)
{
    'use strict';

    var $ = window.jQuery;

    var hasHistory = !!(window.history && typeof window.history.pushState === 'function');

    // fire event once after mutliple quick fires
    // based on: http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
    var debounce = function(func, delay, immediate)
    {
        var timeout;

        return function()
        {
            var obj = this,
                args = arguments,
                callback = function()
                {
                    if (!immediate) {
                        func.apply(obj, args);
                        timeout = null;
                    }
                };
            if (timeout) {
                window.clearTimeout(timeout);
            } else if (immediate) {
                func.apply(obj, args);
            }
            timeout = window.setTimeout(callback, delay);
        };
    };

    // limit number of events fired to regular intervals
    // based on: https://gist.github.com/4135065
    var throttle = function(func, interval)
    {
        var timeout,
            last = new Date();

        return function()
        {
            var obj = this,
                args = arguments,
                callback = function()
                {
                    var now  = new Date(),
                        diff = now - last;

                    if (diff >= interval) {
                        func.apply(obj, args);
                        timeout = null;
                        last = now;
                    } else {
                        timeout = window.setTimeout(function() {
                            callback();
                        }, interval - diff);
                    }
                };
            if (timeout) {
                window.clearTimeout(timeout);
            }
            callback();
        };
    };

    window.App = (function()
    {

        var _init = 0, app = { };

        var overlay = $('#overlay'),
            modal = $('#modal'),
            wrapper = $('#wrapper'),
            _modal = false,
            _centred = true,
            _top = 0;

        var openModal = function()
        {
            if (!_modal) {
                app.docEl.addClass('is-modal');
                _top = app.win.scrollTop();
                overlay.addClass('is-open').attr('aria-hidden', 'false').css({ 'top': 0 });
                wrapper.css({ 'position': 'fixed', 'top': 0 - _top });
            }

            var winHeight = app.win.height(),
                modHeight = modal.outerHeight();

            // available height after padding
            var height = winHeight - (overlay.innerHeight() - overlay.height());

            if (modHeight < height) {
                overlay.innerHeight(height);
                modal.css({ 'margin-top': Math.abs(((height/2) - (modHeight/2))) });
                modal.addClass('is-centered');
                _centred = true;
            } else {
                overlay.height(modHeight);
                modal.css({ 'margin-top': 0 });
                modal.removeClass('is-centered is-cropped');
                //if (_centred) {
                    app.win.scrollTop(0);
                //}
                _centred = false;
            }
        };

        var closeModal = function(state)
        {
            _modal = false;
            _centred = true;
            if (overlay.hasClass('is-open')) {

                // hide modal and overlay
                app.docEl.removeClass('is-modal');
                overlay.removeClass('is-open').attr('aria-hidden', 'true');
                overlay.css({
                    'height': 0,
                    'top': 0
                });

                // return to original state
                wrapper.css({
                    'position': 'static',
                    'top': 'auto'
                });
                app.win.scrollTop(_top);
            }
        };

        app.init = function()
        {
            if (_init++) {
                return;
            }

            app.win    = $(window);
            app.docEl  = $(document.documentElement);
            app.bodyEl = $(document.body);

            app.bodyEl.on('click', '.modal-open', function(e)
            {
                e.preventDefault();
                openModal();
            });

            // switch between modal/target displays
            app.win.on('resize', debounce(function(e)
            {
                if (_modal) {
                    openModal();
                }
            }, 50));

            app.win.on('scroll', function(e)
            {
                if (_modal) {
                    if (app.win.scrollTop() > modal.offset().top) {
                        modal.addClass('is-cropped');
                    } else {
                        modal.removeClass('is-cropped');
                    }
                }
            });

            overlay.on('click', function(e)
            {
                var el = $(e.target);
                if (e.target.href) {
                    return true;
                }
                if (e.target === modal[0] || !el.hasClass('modal-close') && el.closest('#modal').length) {
                    e.preventDefault();
                    return false;
                }
                closeModal();
            });

        };

        return app;

    })();

})(window, window.document);
