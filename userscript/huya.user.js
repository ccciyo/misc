// ==UserScript==
// @name         huya
// @namespace    http://tampermonkey.net/
// @version      2024-12-07
// @description  try to take over the world!
// @author       You
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    observeIframe();
  
    observePlayerCtrlBottom();
  
    changePlayerWidth();
  
    initMsgBot();
  
    function initMsgBot() {
      queryElement(() => {
        return document.querySelector('#tipsOrchat');
      }).then((el) => {
        var iptMsgbot = document.createElement('input');
        iptMsgbot.type = 'text';
        iptMsgbot.style.width = '100%';
  
        el.style.height = '115px';
        el.prepend(iptMsgbot);
        autoSend(iptMsgbot);
      });
  
      function autoSend(iptMsgbot) {
        var time = Math.floor(Math.random() * 16) + 10;
        setTimeout(() => {
          var ipt = document.querySelector('#pub_msg_input');
          ipt.focus();
  
          let val = iptMsgbot.value;
          if (val) {
            document.execCommand('insertText', false, val);
            document.querySelector('#msg_send_bt').click();
          }
  
          autoSend();
        }, time * 1000);
      }
    }
  
    function changePlayerWidth() {
      queryElement(() => {
        return document.querySelector('#J_mainRoom>.match-room');
      }).then((el) => {
        el.style.maxWidth = '100%';
      });
    }
  
    function observePlayerCtrlBottom() {
      queryElement(() => {
        return document.getElementById('player-ctrl-wrap');
      }).then((targetElement) => {
        const ctrlObserver = new MutationObserver(() => {
          const bottom = parseInt(targetElement.style.bottom, 10);
          if (bottom && bottom > 16) {
            targetElement.style.bottom = '16px';
          }
        });
        ctrlObserver.observe(targetElement, {
          attributes: true,
          attributeFilter: ['style'],
        });
      });
    }
  
    function observeIframe() {
      const originalAppendChild = Node.prototype.appendChild;
  
      Node.prototype.appendChild = function (child) {
        if (
          child.tagName === 'IFRAME' &&
          child.id === '__HUYAJSBridgeIframe_DomReady'
        ) {
          console.log('Iframe appended:', child);
          child.remove();
          return child;
        }
  
        return originalAppendChild.call(this, child);
      };
    }
  
    function queryElement(queryFun) {
      return new Promise((resolve, reject) => {
        let intervalIdx = setInterval(() => {
          let el = queryFun();
          if (el) {
            clearInterval(intervalIdx);
            resolve(el);
          }
        }, 200);
      });
    }
  })();
  