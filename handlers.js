var crypto = require('crypto'),
db = require('./db.js').db,
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
                console.log('open collection, start inserting');

                if (err) { throw err; }

                collection.find({
                    email: userObj.email
                }).toArray(function(err, item) {

                    if (err) { throw err; }

                    if (item.length) {
                        console.log('user is already exits');
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
                            console.log('user has been saved');
                        });
                    }
                });
            });

        } catch (e) {
            console.log(e);
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
                console.log('open collection, start login');

                if (err) { throw err; }

                collection.find({
                    email: userObj.email
                }).toArray(function(err, item) {

                    if (err) { throw err; }

                    if (item.length) {
                        if (encrypt(userObj.password) === item[0].password) {
                            console.log('login success');
                            response({
                                code: 0,
                                uid: item[0].uid
                            });
                        } else {
                            console.log('wrong password');
                            response({ code: 4 });
                        }
                    } else {
                        console.log('user not exist');
                        response({ code : 3 });
                    }
                });
            });

        } catch (e) {
            console.log(e);
            callback(e, serverErrObj);
        }
    } else {
        response({ code: 1 });
    }
};

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

function response(obj) {
    callback('', {
        code: obj.code,
        reason: errStr[obj.code],
        uid: obj.uid || ''
    });
}

function testing() {
    var regular = /[a-zA-Z0-9_\.\-]+@([a-zA-Z0-9]+\.)+[a-z]{2,4}/;
    if (userObj.password.length > 20 || userObj.password.length < 3)
        return false;
    if (!userObj.email.match(regular))
        return false;

    return true;
}

function buildUid() {
    var totalLength = 16,
    dateStr = new Date().getTime().toString(16),
    randomStr = Math.floor(
        (1 + Math.random()) *
        Math.pow(16, (totalLength - dateStr.length))
    ).toString(16);

    return dateStr + randomStr;
}

function encrypt(pw) {
    var hmac = crypto.createHash('sha256');
    hmac.update(pw);
    return hmac.digest('hex');
}


