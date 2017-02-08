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
    win.loadCSS = function(href, callback)
    {
        var css = doc.createElement('link'),
            sheets = doc.styleSheets,
            i = 0;
        css.rel = 'stylesheet';
        css.media = 'only x';
        css.href = href;
        css.onload = callback || function(){};
        fs.parentNode.insertBefore(css, fs);
        function toggle() {
            for (i = 0; i < sheets.length; i++) {
                if (sheets[i].href && sheets[i].href.indexOf(href) > -1) {
                    css.media = 'all';
                    return;
                }
            }
            setTimeout(toggle);
        }
        toggle();
    };

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

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-cssanimations-csstransforms-flexbox-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function s(){var e,n,t,s,o,i,a;for(var l in C)if(C.hasOwnProperty(l)){if(e=[],n=C[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=r(n.fn,"function")?n.fn():n.fn,o=0;o<e.length;o++)i=e[o],a=i.split("."),1===a.length?Modernizr[a[0]]=s:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=s),g.push((s?"":"no-")+a.join("-"))}}function o(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(_&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),_?x.className.baseVal=n:x.className=n)}function i(e,n){return!!~(""+e).indexOf(n)}function a(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):_?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function f(e,n){return function(){return e.apply(n,arguments)}}function u(e,n,t){var s;for(var o in e)if(e[o]in n)return t===!1?e[o]:(s=n[e[o]],r(s,"function")?f(s,t||n):s);return!1}function d(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function c(){var e=n.body;return e||(e=a(_?"svg":"body"),e.fake=!0),e}function p(e,t,r,s){var o,i,l,f,u="modernizr",d=a("div"),p=c();if(parseInt(r,10))for(;r--;)l=a("div"),l.id=s?s[r]:u+(r+1),d.appendChild(l);return o=a("style"),o.type="text/css",o.id="s"+u,(p.fake?p:d).appendChild(o),p.appendChild(d),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(n.createTextNode(e)),d.id=u,p.fake&&(p.style.background="",p.style.overflow="hidden",f=x.style.overflow,x.style.overflow="hidden",x.appendChild(p)),i=t(d,e),p.fake?(p.parentNode.removeChild(p),x.style.overflow=f,x.offsetHeight):d.parentNode.removeChild(d),!!i}function m(n,r){var s=n.length;if("CSS"in e&&"supports"in e.CSS){for(;s--;)if(e.CSS.supports(d(n[s]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var o=[];s--;)o.push("("+d(n[s])+":"+r+")");return o=o.join(" or "),p("@supports ("+o+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return t}function h(e,n,s,o){function f(){d&&(delete P.style,delete P.modElem)}if(o=r(o,"undefined")?!1:o,!r(s,"undefined")){var u=m(e,s);if(!r(u,"undefined"))return u}for(var d,c,p,h,v,y=["modernizr","tspan"];!P.style;)d=!0,P.modElem=a(y.shift()),P.style=P.modElem.style;for(p=e.length,c=0;p>c;c++)if(h=e[c],v=P.style[h],i(h,"-")&&(h=l(h)),P.style[h]!==t){if(o||r(s,"undefined"))return f(),"pfx"==n?h:!0;try{P.style[h]=s}catch(g){}if(P.style[h]!=v)return f(),"pfx"==n?h:!0}return f(),!1}function v(e,n,t,s,o){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+b.join(i+" ")+i).split(" ");return r(n,"string")||r(n,"undefined")?h(a,n,s,o):(a=(e+" "+E.join(i+" ")+i).split(" "),u(a,n,t))}function y(e,n,r){return v(e,t,t,n,r)}var g=[],C=[],w={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){C.push({name:e,fn:n,options:t})},addAsyncTest:function(e){C.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=w,Modernizr=new Modernizr;var x=n.documentElement,_="svg"===x.nodeName.toLowerCase(),S="Moz O ms Webkit",b=w._config.usePrefixes?S.split(" "):[];w._cssomPrefixes=b;var E=w._config.usePrefixes?S.toLowerCase().split(" "):[];w._domPrefixes=E;var N={elem:a("modernizr")};Modernizr._q.push(function(){delete N.elem});var P={style:N.elem.style};Modernizr._q.unshift(function(){delete P.style}),w.testAllProps=v,w.testAllProps=y,Modernizr.addTest("cssanimations",y("animationName","a",!0)),Modernizr.addTest("flexbox",y("flexBasis","1px",!0)),Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&y("transform","scale(1)",!0)}),s(),o(g),delete w.addTest,delete w.addAsyncTest;for(var T=0;T<Modernizr._q.length;T++)Modernizr._q[T]();e.Modernizr=Modernizr}(window,document);
