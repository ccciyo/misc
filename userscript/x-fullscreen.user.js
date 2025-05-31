// ==UserScript==
// @name         X Fullscreen
// @namespace    http://tampermonkey.net/
// @version      2025-05-31
// @description  Fullscreen X
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';


    let interval = setInterval(() => {
        var main = document.querySelector('main')
        if (main) {
            main.style.flexGrow = '5';

            var element = main.querySelector('[data-testid="primaryColumn"]');
            if (element) {
                const classes = Array.from(element.classList);
                const styleSheets = Array.from(document.styleSheets);

                for (const sheet of styleSheets) {
                    if (sheet.disabled) continue; // Skip disabled stylesheets

                    try {
                        const rules = Array.from(sheet.cssRules || sheet.rules);
                        for (const rule of rules) {
                            checkRule(rule, classes);
                        }
                    } catch (error) {
                        console.warn('Cannot access rules from stylesheet:', error);
                    }
                }
                clearInterval(interval);
            }
            // var sidebarColumn = main.querySelector('[data-testid="sidebarColumn"]');
            // if (sidebarColumn) {
            //     sidebarColumn.style.display = 'none';
            // }
        }

    }, 200);

    function checkRule(rule, classes) {
        // Handle nested rules (media queries, etc.)
        if (rule.cssRules) {
            Array.from(rule.cssRules).forEach(nestedRule => checkRule(nestedRule, classes));
        }

        // Process only style rules
        if (rule.type !== 1) return; // Not a STYLE_RULE (type 1)

        const selectorText = rule.selectorText;
        if (!selectorText || !selectorText.includes('.')) return; // Skip if no class selector

        // Check if any class from the element is present in this rule's selectors
        const hasTargetClass = classes.some(cls =>
            selectorText.split(',').some(selector =>
                selector.includes(`.${cls}`) &&
                rule.style.getPropertyValue('max-width') !== ''
            )
        );

        if (hasTargetClass) {
            rule.style.setProperty('max-width', '100%', 'important');
        }
    }


})();
