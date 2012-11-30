var crypto = require('crypto'),
    db = require('./db.js').db,
    log = require('./log.js').log,
    logType = require('./log.js').types,

    ERROR_DESCRIPTIONS = ['', 'INVALID_INPUTS', 'EMAIL_ALREADY_EXIST',
              'EMAIL_NOT_EXIST', 'WRONG_PASSWORD'
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
            log('open collection, start inserting');

            if (err) { throw err; }

            collection.find({
                email: user.email
            }).toArray(function(err, item) {

                if (err) { throw err; }

                if (item.length) {
                    log(logType.WARNING, 'user is already exits: ' + user.email);
                    response({ code : 2 }, callback);
                    return;
                }

                user.uid = buildUid();
                user.password = encrypt(user.password);

                collection.insert(user, function(err, results) {
                    if (err) { throw err; }

                    response({
                        code: 0,
                        uid: user.uid
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
            log('open collection, start login');

            if (err) { throw err; }

            collection.find({
                email: user.email
            }).toArray(function(err, item) {
                if (err) { throw err; }

                if (!item.length) {
                    log(logType.WARNING, 'user not exist:' + user.email);
                    response({ code : 3 }, callback);
                    return;
                }

                if (encrypt(user.password) === item[0].password) {
                    log('login success' + item[0].email);
                    response({
                        code: 0,
                        uid: item[0].uid
                    }, callback);
                } else {
                    log(logType.WARNING,
                        'wrong password:' + item[0].email);
                        response({ code: 4 }, callback);
                }
            });
        });
    } catch (e) {
        log(logType.ERROR, e);
        callback(e, serverErrObj);
    }
};

// 初始化用户参数并校验
function handleData(req) {
    var body = req.body,
    headers = req.headers;

    return {
        email : body['email'],
        password : body['password'],
        ua : headers['x-wonder-user-agent']
    };
}

// 正常200返回
function response(obj, callback) {
    callback('', {
        code: obj.code,
        reason: ERROR_DESCRIPTIONS[obj.code],
        uid: obj.uid || ''
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

// 加密
function encrypt(pw) {
    var hmac = crypto.createHash('sha256');
    hmac.update(pw);
    return hmac.digest('hex');
}

