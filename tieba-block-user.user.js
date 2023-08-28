// ==UserScript==
// @name         贴吧屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tieba.baidu.com/p/*
// @match        https://*.tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let postList = document.querySelectorAll('#j_p_postlist>div')
    let blockUids = new Set()
    blockUids.add(6421022725)
    for (let item of postList) {
        let dataStr = item.getAttribute('data-field')
        if (dataStr) {
            let data = JSON.parse(dataStr);
            if (data.author.level_id <= 1 && data.author.user_id != data.content.builderId) {
                item.style.display = 'none'
            }
            if (blockUids.has(data.author.user_id)) {
                item.style.display = 'none'
            }
        }
    }
    // Your code here...
})();
