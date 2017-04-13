/*!
 * based on FitVids | https://github.com/davatron5000/FitVids.js
 */
(function (window, document) {
  if (!document.querySelectorAll || !Array.prototype.forEach) {
    return;
  }
  window.fitVids = function() {
    var videos = [];
    var selectors = [
      'iframe[src*="player.vimeo.com"]',
      'iframe[src*="youtube.com"]',
      'iframe[src*="youtube-nocookie.com"]',
      'iframe[src*="kickstarter.com"][src*="video.html"]'
    ];

    selectors.forEach(function (selector) {
      var el = document.querySelectorAll(selector);
      if (el.length > 0) {
        Array.prototype.push.apply(videos, Array.prototype.slice.call(el));
      }
    });

    if (videos.length === 0) {
      return;
    }

    if (!document.getElementById('fitvids-style')) {
      var css = '.b-fitvid{width:100%;position:relative;padding:0;}.b-fitvid iframe,.b-fitvid object,.b-fitvid embed {position:absolute;top:0;left:0;width:100%;height:100%;margin:0;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fitvids-style">' + css + '</style>';
      document.getElementsByTagName('head')[0].appendChild(div.childNodes[1]);
    }

    videos.forEach(function (video) {
      var parent = video.parentNode;
      if (video.tagName.toLowerCase() === 'embed' && parent.tagName.toLowerCase() === 'object') {
        return;
      }
      if (parent.className.indexOf('b-fitvid') > -1) {
        return;
      }

      var height = parseInt(video.getAttribute('height'), 10);
      var width = parseInt(video.getAttribute('width'), 10);
      if (isNaN(height) || isNaN(width)) {
        height = 9;
        width = 16;
      }
      var ratio = height / width;

      var wrapper = document.createElement('div');
      wrapper.className = 'b-fitvid';
      wrapper.setAttribute('style', 'padding-top:' + (ratio * 100) + '%');
      parent.insertBefore(wrapper, video);
      wrapper.appendChild(video);
      video.removeAttribute('height');
      video.removeAttribute('width');
    });
  };
  fitVids();
})(window, window.document);
