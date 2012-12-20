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

var sync = background.network.sync;

var userInfo = background.userInfo;
