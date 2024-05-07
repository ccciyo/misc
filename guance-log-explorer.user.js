// ==UserScript==
// @name         guance logs
// @namespace    http://tampermonkey.net/
// @version      2024-05-07
// @description  try to take over the world!
// @author       You
// @match        https://obs.geely.com/logIndi/log/all*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geely.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
  
    var style = document.createElement('style');
    style.innerHTML = '.json-value { max-width: 1024px !important; }';
    document.head.appendChild(style);
  
    // Select the node that will be observed for mutations
    let targetNode;
  
    // Options for the observer (which mutations to observe)
    let config = { childList: true, subtree: true };
  
    // Callback function to execute when mutations are observed
    let callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // A child node has been added
          for (let node of mutation.addedNodes) {
            let actionNode = node.querySelector(
              '.message-cell-render_expand-action_icon'
            );
            if (actionNode) {
              actionNode.click();
              break;
            }
          }
        }
      }
    };
  
    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);
  
    let i = setInterval(() => {
      targetNode = document.querySelector(
        '#grid-wrapper .ag-center-cols-container'
      );
      if (targetNode) {
        observer.observe(targetNode, config);
        clearInterval(i);
      }
    }, 200);
  })();
  