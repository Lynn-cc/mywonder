var db = require('./db.js').db,
log = require('./log.js').log,
logType = require('./log.js').types,
serverErrObj = {
    code: -1,
    reason: 'SERVER_ERROR'
};

exports.sync = function(req, callback) {
    var data = handleData(req);
    callback('', {
        hello: 'hello'
    });
};

function handleData(req) {
    var body = req.body,
    headers = req.headers;
    
    return {
        uid: body.uid,
        uniqueCode: body.uniqueCode,
        ua: headers.ua,
        bm: body.bookmarks
    };
}
