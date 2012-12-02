/**
 * Name: network.js
 * Description: Defined interfaces for common network operation
 * Environment: All Broswer
 * Version: 0.1
 */

window.network = new (function() {
    var _path = {
        root: 'http://127.0.0.1:8888',
        login: '/login',
        signup: '/signup',
        logout: '/logout'
    },
    _ua = _userAgent();

    this.login = function(data, callbacks) {
        $.ajax({
            type: 'POST',
            url: _path.root + _path.login,
            data: data,
            headers: {
                'X-Wonder-User-Agent': _ua
            },
            dataType: 'json',
            timeout: 10000,
            success: callbacks.success,
            error: callbacks.error
        });
    };

    this.signup = function(data, callbacks) {
        $.ajax({
            url: _path.root + _path.signup,
            type: 'POST',
            data: data,
            headers: {
                'X-Wonder-User-Agent': _ua
            },
            dataType: 'json',
            timeout: 10000,
            success: callbacks.success,
            error: callbacks.error
        });
    };

    this.logout = function(data, callbacks) {
        $.ajax({
            url: _path.root + _path.logout,
            type: 'POST',
            data: data, 
            headers: {
                'X-Wonder-User-Agent': _ua
            },
            dataType: 'json',
            timeout: 10000,
            success: callbacks.success,
            error: callbacks.error
        });
    }

    function _userAgent() {
        var ua = navigator.userAgent.toLowerCase(),
        appName = getAppName();
        platform = {
            Linux: /linux/,
            Win32: /windows|win32/,
            Mac: /macintosh|mac os x/
        };
        for (var key in platform) {
            if (platform[key].test(ua)) {
                return key + '/' + appName;
            }
        }
        return 'Other' + '/' + appName;
    }

})();

