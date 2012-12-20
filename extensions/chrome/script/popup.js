/*
* Name: popup.js
* Description: Javascript file for the popup page of chrome
* Environment: Chrome
* Version: 0.1
*/

(function() {
    var WAITING = 1,
        FINISH_WAITING = 0;
        FAIL_SYNC = -1,
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

        // TODO 多种状态 灵活切换，增加同步成功状态
        if (status === WAITING) {
            if (!classes.match('waiting')) {
                if (classes.match('failed')) {
                    target.className = classes.replace(' failed', '');
                }
                target.className += ' waiting';
                target.innerHTML = '同步中';
            }
        } else if (status === FINISH_WAITING) {
            if (classes.match('waiting')) {
                target.className = classes.replace(' waiting', '');
                target.innerHTML = '立即同步';
            } else if (classes.match('failed')) {
                target.className = classes.replace(' failed', '');
                target.innerHTML = '立即同步';
            }
        } else if (status === FAIL_SYNC) {
            if (classes.match('waiting')) {
                target.className = classes.replace(' waiting', ' failed');
                target.innerHTML = '同步失败';
            }
        }
    }

    function sync() {
        var target = $('syncBtn');
        if (!waitingStatus) {
            waitingStatus = WAITING;
            switchWaitingStatus(target, WAITING);

            background.sync({
                success: function() {
                    switchWaitingStatus(target, FINISH_WAITING);
                    waitingStatus = false;
                },
                error: function() {
                    switchWaitingStatus(target, FAIL_SYNC);
                    waitingStatus = false;
                }
            });
        }
    }

    on($('syncBtn'), 'click', sync);
    on($('settingBtn'), 'click', background.openOptionPage);

})();
