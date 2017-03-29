/*
 * Copyright (c) David Bushell | @dbushell | http://dbushell.com
 */
(function(win, doc)
{
    var db = win.dbushell = { },
        cn = 'js',
        ua = navigator.userAgent,
        de = doc.getElementsByTagName('html')[0],
        fs = doc.getElementsByTagName('script')[0];

    win.loadScript = function(src, callback)
    {
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

    // https://github.com/filamentgroup/loadCSS
    // win.loadCSS = function(href, callback)
    // {
    //     var css = doc.createElement('link'),
    //         sheets = doc.styleSheets,
    //         i = 0;
    //     css.rel = 'stylesheet';
    //     css.media = 'only x';
    //     css.href = href;
    //     css.onload = callback || function(){};
    //     fs.parentNode.insertBefore(css, fs);
    //     function toggle() {
    //         for (i = 0; i < sheets.length; i++) {
    //             if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
    //                 css.media = 'all';
    //                 return;
    //             }
    //         }
    //         setTimeout(toggle);
    //     }
    //     toggle();
    // };

    // // remove JavaScript support in Opera Mini
    // if (ua.indexOf('Opera Mini') >= 0 && Object.prototype.toString.call(win.operamini) === "[object OperaMini]") {
    //     de.className = (' ' + de.className + ' ').replace(' js ', ' no-js ').replace(/^\s+|\s+$/g,'');
    // }

    // fix Windows Phone 8 viewport bug
    if (ua.match(/IEMobile\/10\.0/)) {
        var s = doc.createElement('style');
        s.appendChild(doc.createTextNode('@-ms-viewport{width:auto!important}'));
        fs.parentNode.insertBefore(s, fs);
    }

    db.isFF      = !!ua.match(/firefox/i);
    db.isOldIE   = !!(document.all && !document.addEventListener);
    db.isIE      = !!window.ActiveXObject || window.navigator.msPointerEnabled;
    db.isAndroid = !!(ua.match(/Android/) && ua.match(/AppleWebKit/) && !ua.match(/Chrome/));
    db.isIOS     = /(iPhone|iPad|iPod)/gi.test(ua);

    if (db.isAndroid) {
        cn += ' js-android';
    }

    if (db.isIOS) {
        cn += ' js-ios';
    }

    if (db.isIE) {
        cn += ' js-ie';
    }

    // db.onLoad = function() {

    //     var div = doc.createElement('div');

    //     function testProp(ucProp) {
    //         var i, props = (['webkit', 'Moz', 'O', 'ms'].join(ucProp + ' ') + ucProp).split(' ');
    //         for (i in props) {
    //             if (div.style[props[i]] !== undefined) {
    //                 return true;
    //             }
    //         }
    //         return false;
    //     }

    //     // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/transforms3d.js
    //     db.hasCSS3D = testProp(['Perspective']);
    //     if (db.hasCSS3D && 'webkitPerspective' in de.style) {
    //         var ss = doc.createElement('style');
    //         ss.innerHTML = '@media (transform-3d),(-webkit-transform-3d){#dbushell{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}';
    //         div.id = 'dbushell';
    //         doc.body.appendChild(ss);
    //         doc.body.appendChild(div);
    //         db.hasCSS3D = div.offsetLeft === 9 && div.offsetHeight === 5;
    //         div.parentNode.removeChild(div);
    //         ss.parentNode.removeChild(ss);
    //     }

    //     // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg/inline.js
    //     div.innerHTML = '<svg/>';
    //     db.hasSVG = (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';

    //     de.className += db.hasSVG ? ' svg' : ' no-svg';
    //     de.className += db.hasCSS3D ? ' css3d' : ' no-css3d';
    // };

    var start = new Date().getTime();

    win.loadScript('//use.typekit.net/vjw4wno.js', function() {
        if (!Typekit) return;
        try {
            Typekit.load();
            if ((new Date().getTime() - start) > 1000) {
                var i, tk, sheets = doc.getElementsByTagName('link');
                for (i = 0; i < sheets.length; i++) {
                    if (sheets[i].rel === 'stylesheet' && sheets[i].href && sheets[i].href.indexOf('typekit.net') > -1) {
                        tk = sheets[i];
                        tk.media = 'only x';
                        tk.onload = function() {
                            tk.media = 'all';
                        };
                    }
                }
            }
        } catch(e) { };
    });

    cn += ' wf-loading';

    de.className = de.className.replace(/(^|\s)no-js(\s|$)/, '$1' + cn + '$2');

})(window, document);
