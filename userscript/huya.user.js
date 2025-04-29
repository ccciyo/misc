// ==UserScript==
// @name         huya
// @namespace    http://tampermonkey.net/
// @version      2024-12-07
// @description  try to take over the world!
// @author       You
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @require      https://github.com/ccciyo/misc/blob/master/userscript/tools/AutoCaller.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    observeIframe();

    observePlayerCtrlBottom();

    changePlayerWidth();

    initMsgBot();

    hookStreamRate();

    function hookStreamRate() {
        queryElement(() => {
            return document.querySelector('#player-ctrl-wrap > div.player-ctrl-btn > div.player-videotype > div.player-menu-panel.player-menu-panel-common > div.player-videoline-videotype > ul > li:nth-child(1)');
        }).then((el) => {
            let d = $(el).data();
            let data = d.data;
            data.iBitRate = data.iSortValue
            data.iHEVCBitRate = data.iSortValue
            data.iEnable = 1
            data.iEnableMethod = 0
            data.sTagText = ''
            $(el).data(data);
            el.querySelector('div').remove()
        });

    }

    function initMsgBot() {
        queryElement(() => {
            return document.querySelector('#tipsOrchat');
        }).then((el) => {
            var iptMsgbot = document.createElement('input');
            iptMsgbot.type = 'text';
            iptMsgbot.style.width = '100%';

            el.style.height = '115px';
            el.prepend(iptMsgbot);

            autoCallWithRateLimit(autoSend, 10, 60000, () => [iptMsgbot]);
        });

        function autoSend(iptMsgbot) {
            var ipt = document.querySelector('#pub_msg_input');
            ipt.focus();

            let val = iptMsgbot.value;
            if (val) {
                document.execCommand('insertText', false, val);
                document.querySelector('#msg_send_bt').click();
            }
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
