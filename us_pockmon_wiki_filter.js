// ==UserScript==
// @name         pm filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wiki.52poke.com/wiki/%E7%A7%8D%E6%97%8F%E5%80%BC%E5%88%97%E8%A1%A8%EF%BC%88%E7%AC%AC%E4%BA%94%E4%B8%96%E4%BB%A3%EF%BC%89
// @icon         https://www.google.com/s2/favicons?sz=64&domain=52poke.com
// @grant        none
// @run-at       document-idle

// ==/UserScript==

(function () {
  'use strict';
  var btnFilter = document.createElement('button');
  btnFilter.innerHTML = 'FilterPM';
  btnFilter.onclick = () => {
    Array.from(
      document
        .querySelector('#mw-content-text>div.mw-parser-output>table')
        .querySelectorAll('tbody>tr')
    ).filter(function (item) {
      var _children = item.children;
      var gj = getVal(_children[4]);
      var tg = getVal(_children[6]);
      var sd = getVal(_children[8]);
      if (!((gj >= 100 || tg >= 100) && sd >= 90)) {
        item.remove();
      }
    });
    function getVal(ele) {
      if (ele) {
        return parseInt((ele.innerHTML || '0').trim());
      }
      return '0';
    }
  };
  document
    .querySelector('div#mw-content-text>div.mw-parser-output>h2')
    .append(btnFilter);

  // Your code here...
})();
