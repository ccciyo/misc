// ==UserScript==
// @name         贴吧屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tieba.baidu.com/p/*
// @match        https://*.tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @downloadURL  https://github.com/ccciyo/misc/raw/master/tieba-block-user.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  let postList = document.querySelectorAll('#j_p_postlist>div')
  let blockUids = new Set()
  let blocklistKey = 'tieba_blockUids';

  initBlockList();
  filterPost();

  function initBlockList() {
    let blocklistStr = localStorage.getItem(blocklistKey);
    if (blocklistStr) {
      blockUids = new Set(JSON.parse(blocklistStr))
    }
  }

  function filterPost() {
    for (let item of postList) {
      let dataStr = item.getAttribute('data-field')
      if (dataStr) {
        let data = JSON.parse(dataStr);
        if (blockUids.has(data.author.user_id)) {
          item.style.display = 'none'
        }
        let actionEl = item.querySelector('.d_author>.p_author');
        actionEl.appendChild(createBlockButten(item, data))
      }
    }
  }

  function createBlockButten(postEl, data) {
    let elLi = document.createElement('li')
    elLi.className='l_badge'
    elLi.style='display:block;'
    let elA = document.createElement('a')
    elA.innerText = "blockUser"
    elA.href = '#'
    elA.onclick = function (e) {
      blockUids.add(data.author.user_id)
      localStorage.setItem(blocklistKey, JSON.stringify(blockUids))
      postEl.style.display = 'none'
      return false
    }
    elLi.appendChild(elA)
    return elLi;
  }

})();
