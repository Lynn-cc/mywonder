var crypto = require('crypto'),
db = require('./db.js').db,
log = require('./log.js').log,
logType = require('./log.js').types,

ERROR_DESCRIPTIONS = ['', 'INVALID_INPUTS', 'EMAIL_ALREADY_EXIST',
    'EMAIL_NOT_EXIST', 'WRONG_PASSWORD', 'UNEXPECTED_ERROR'
],

serverErrObj = {
    code: -1,
    reason: 'SERVER_ERROR'
};

exports.signup = function(req, callback) {
    var user = handleData(req);

    if (!validate(user)) {
        response({ code: 1 }, callback);
        return;
    }

    try {
        db.collection('user', function(err, collection) {

            if (err) { throw err; }

            collection.findOne({
                email: user.email
            }, function(err, item) {

                if (err) { throw err; }

                if (item) {
                    log(logType.WARNING, 'user already exits');
                    response({ code : 2 }, callback);
                    return;
                }

                var uniqueCode = buildUniqueCode();
                var uid = buildUid();
                var broswers = {};
                broswers[uniqueCode] = user.ua;

                collection.insert({
                    email: user.email,
                    uid: uid,
                    password: encrypt(user.password),
                    broswers: broswers

                }, function(err, results) {
                    if (err) { throw err; }

                    response({
                        code: 0,
                        uid: uid,
                        uniqueCode: uniqueCode
                    }, callback);

                    log('user has been saved: ' + user.email);
                });
            });
        });

    } catch (e) {
        log(logType.ERROR, e);
        callback(e, serverErrObj);
    }
};

exports.login = function(req, callback) {
    var user = handleData(req);

    if (!validate(user)) {
        response({ code: 1 }, callback);
        return;
    }

    try {
        db.collection('user', function(err, collection) {

            if (err) { throw err; }

            collection.findOne({
                email: user.email
            }, function(err, item) {
                var uniqueCode,
                newBroswer = item.broswers;
                if (err) { throw err; }

                if (!item) {
                    log(logType.WARNING, 'mail not exist');
                    response({ code : 3 }, callback);
                    return;
                }

                if (encrypt(user.password) === item.password) {
                    log('login success' + item.email);
                    uniqueCode = buildUniqueCode();
                    newBroswer[uniqueCode] = user.ua;
                    collection.update({
                        email: user.email
                    }, {
                        $set: {
                            broswers: newBroswer
                        }
                    });
                    response({
                        code: 0,
                        uid: item.uid,
                        uniqueCode: uniqueCode
                    }, callback);
                } else {
                    log(logType.WARNING,
                        'wrong password:' + item.email);
                        response({ code: 4 }, callback);
                }
            });
        });
    } catch (e) {
        log(logType.ERROR, e);
        callback(e, serverErrObj);
    }
};

exports.logout = function(req, callback) {
    var user = handleData(req);
    try {
        db.collection('user', function(err, collection) {
            if (err) { throw err; }

            collection.findOne({
                uid: user.uid
            }, function(err, item) {
                var newBroswer;
                if (err) { throw err; }
                if (!item) {
                    log(logType.WARNING, 'wrong uid');
                    response({
                        code: 5
                    }, callback);
                }
                newBroswer = item.broswers;

                if (newBroswer[user.uniqueCode]) {
                    log('logout success' + item.email);
                    delete newBroswer[user.uniqueCode];
                    collection.update({
                        uid: user.uid
                    }, {
                        $set: {
                            broswers: newBroswer
                        }
                    });
                } else {
                    log(logType.WARNING, 'wrong uniqueCode');
                    response({
                        code: 5
                    }, callback);
                }
            });
        });

    } catch(e) {
        log(logType.ERROR, e);
        callback(e, serverErrObj);
    }
};

// 初始化用户参数并校验
function handleData(req) {
    var body = req.body,
    headers = req.headers;

    return {
        email : body['email'] || '',
        password : body['password'] || '',
        ua : headers['x-wonder-user-agent'],
        uniqueCode: body['uniqueCode'] || '',
        uid: body['uid'] || ''
    };
}

// 正常200返回
function response(obj, callback) {
    callback('', {
        code: obj.code,
        reason: ERROR_DESCRIPTIONS[obj.code],
        uid: obj.uid || '',
        uniqueCode: obj.uniqueCode || ''
    });
}

// 校验用户参数
function validate(user) {
    var regular = /[a-zA-Z0-9_\.\-]+@([a-zA-Z0-9]+\.)+[a-z]{2,4}/;
    if (user.password.length > 20 || user.password.length < 5)
        return false;
    if (!user.email.match(regular))
        return false;

    return true;
}

// 生成用户id
function buildUid() {
    var totalLength = 16,
    dateStr = new Date().getTime().toString(16),
    randomStr = Math.floor(
        (1 + Math.random()) *
        Math.pow(16, (totalLength - dateStr.length))
    ).toString(16);

    return dateStr + randomStr;
}

// 生成唯一码
function buildUniqueCode() {
    var totalLength = 16,
    dateStr = new Date().getTime().toString(16),
    randomStr = Math.floor(
        (1 + Math.random()) *
        Math.pow(16, (totalLength - dateStr.length))
    ).toString(16);

    return encrypt(dateStr + randomStr, 'MD5');
}

// 加密
function encrypt(pw, type) {
    var hmac = type ? crypto.createHash(type) : crypto.createHash('sha256');
    hmac.update(pw);
    return hmac.digest('hex');
}

