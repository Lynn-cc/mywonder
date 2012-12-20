var personalHandler = require('./personalHandlers.js'),
    favoriteHandler = require('./favoriteHandlers.js');

exports.signup = personalHandler.signup;
exports.login = personalHandler.login;
exports.logout = personalHandler.logout;
exports.sync = favoriteHandler.sync;
