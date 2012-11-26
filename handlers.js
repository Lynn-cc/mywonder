var crypto = require('crypto'),
db = require('./db.js').db,
log = require('./log.js').log,
logType = require('./log.js').types,

//fs = require('fs'),
//pem = fs.readFileSync('server.pem'),
//key = pem.toString('ascii'),

errStr = ['', 'INVALID_INPUTS', 'EMAIL_ALREADY_EXIST', 'EMAIL_NOT_EXIST', 'WRONG_PASSWORD'],
serverErrObj = {
    code: -1,
    reason: 'SERVER_ERROR'
},

userObj = {},
callback;


exports.signup = function(req, cb) {
    if (handlerData(req, cb)) {
        try {
            db.collection('user', function(err, collection) {
                log('open collection, start inserting');

                if (err) { throw err; }

                collection.find({
                    email: userObj.email
                }).toArray(function(err, item) {

                    if (err) { throw err; }

                    if (item.length) {
                        log(logType.WARNING,
                            'user is already exits: ' + userObj.email);
                        response({ code : 2 });

                    } else {
                        userObj.uid = buildUid();
                        userObj.password = encrypt(userObj.password);

                        collection.insert(userObj, function(err, results) {
                            if (err) { throw err; }

                            response({
                                code: 0,
                                uid: userObj.uid
                            });
                            log('user has been saved: ' + userObj.email);
                        });
                    }
                });
            });

        } catch (e) {
            log(logType.ERROR, e);
            callback(e, serverErrObj);
        }
    } else {
        response({ code: 1 });
    }
};

exports.login = function(req, cb) {
    if (handlerData(req, cb)) {
        try {
            db.collection('user', function(err, collection) {
                log('open collection, start login');

                if (err) { throw err; }

                collection.find({
                    email: userObj.email
                }).toArray(function(err, item) {

                    if (err) { throw err; }

                    if (item.length) {
                        if (encrypt(userObj.password) === item[0].password) {
                            log('login success' + item[0].email);
                            response({
                                code: 0,
                                uid: item[0].uid
                            });
                        } else {
                            log(logType.WARNING,
                                'wrong password:' + item[0].email);
                            response({ code: 4 });
                        }
                    } else {
                        log(logType.WARNING, 'user not exist:' + userObj.email);
                        response({ code : 3 });
                    }
                });
            });

        } catch (e) {
            log(logType.ERROR, e);
            callback(e, serverErrObj);
        }
    } else {
        response({ code: 1 });
    }
};

// 初始化用户参数并校验
function handlerData(req, cb) {
    var body = req.body,
    headers = req.headers;

    userObj = {
        email : body['email'],
        password : body['password'],
        ua : headers['x-wonder-user-agent']
    };

    callback = cb;

    return testing();
}

// 正常200返回
function response(obj) {
    callback('', {
        code: obj.code,
        reason: errStr[obj.code],
        uid: obj.uid || ''
    });
}

// 校验用户参数
function testing() {
    var regular = /[a-zA-Z0-9_\.\-]+@([a-zA-Z0-9]+\.)+[a-z]{2,4}/;
    if (userObj.password.length > 20 || userObj.password.length < 5)
        return false;
    if (!userObj.email.match(regular))
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
