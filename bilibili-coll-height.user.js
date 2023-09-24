// ==UserScript==
// @name         bilibili-coll-height
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let el = document.querySelector('#app > div.video-container-v1 > div.right-container.is-in-large-ab div.video-sections-content-list');
    if(el){
        el.style.maxHeight = '350px'
        el.style.minHeight = '350px'
    }
    // Your code here...
})();
