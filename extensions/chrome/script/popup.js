/*
* Name: popup.js
* Description: Javascript file for the popup page of chrome
* Environment: Chrome
* Version: 0.1
*/

(function() {
    var WAITING = 1,
        FINISH_WAITING = 0;
        background = chrome.extension.getBackgroundPage();
        waitingStatus = FINISH_WAITING;

    function $(id) {
        return document.getElementById(id);
    }

    function on(el, type, fn) {
        el.addEventListener(type, fn, false);
    }

    function switchWaitingStatus(target, status) {
        var classes = target.className;

        if (status === WAITING) {
            if (!classes.match('waiting')) {
                target.className += ' waiting';
                target.innerHTML = '同步中';
            }
        } else {
            if (classes.match('waiting')) {
                target.className.replace(' waiting', '');
                target.innerHTML = '立即同步';
            }
        }
    }

    function sync() {
        var target = $('syncBtn');
        if (!waitingStatus) {
            waitingStatus = WAITING;
            switchWaitingStatus(target, WAITING);

            background.syncBookmarks(function() {
                switchWaitingStatus(target, FINISH_WAITING);
                switchWaitingStatus = FINISH_WAITING;
            });
        }
    }

    on($('syncBtn'), 'click', sync);
    on($('settingBtn'), 'click', background.openOptionPage);

})();
