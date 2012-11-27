/**
 * Name: connect.js
 * Description: Defined interfaces communicated
 *              to the background for the option page
 * Environment: Chrome
 * Version: 0.1
 */

var background = chrome.extension.getBackgroundPage();

var signup = background.network.signup;

var login = background.network.login;

var logout = background.network.logout;

var userInfo = new function() {
    var storage = chrome.storage.local;
    this.set = function(arg1, arg2) {
        storage.set(arg1, arg2);
    };
    this.get = function(arg1, arg2) {
        storage.get(arg1, arg2);
    };
    this.clear = function(arg1) {
        storage.clear(arg1);
    };
}();

