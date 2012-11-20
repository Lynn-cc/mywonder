var db = require('./db.js').db,
errStr = ['', 'INVALID_INPUTS', 'EMAIL_ALREADY_EXIST'],
serverErrObj = {
    code: -1,
    reason: 'SERVER_ERROR'
};

exports.signup = function(req, callback) {
    var body = req.body,
    headers = req.headers,
    userObj = {
        email : body['email'],
        password : body['password'],
        ua : headers['x-wonder-user-agent']
    };

    try {
        db.collection('user', function(err, collection) {
            console.log('open collection, start inserting');

            var test;

            if (err) { throw err; }

            test = testing(userObj);

            if (!test) {
                response({ code: 1 });

            } else {

                collection.find({
                    email: userObj.email
                }).toArray(function(err, item) {

                    if (item.length) {
                        console.log('user is already exits');
                        response({ code : 2 });

                    } else {
                        userObj.uid = buildUid(body['email']);

                        collection.insert(userObj, function(err, results) {
                            if (err) { throw err; }

                            response({
                                code: 0,
                                uid: userObj.uid
                            });
                            console.log('user has been saved')
                        });
                    }
                });
            }

        });

    } catch (e) {
        console.log(e);
        callback(e, serverErrObj);
    }

    function response(obj) {
        callback('', {
            code: obj.code,
            reason: errStr[obj.code],
            uid: obj.uid || ''
        });
    }

};

function testing(userObj) {
    var regular = /[a-zA-Z0-9_\.\-]+@([a-zA-Z0-9]+\.)+[a-z]{2,4}/;
    if (userObj.password.length < 20)
        return false;
    if (!userObj.mail.match(regular))
        return false;

    return true;
}

function buildUid(email) {
    var date = new Date(),
    random = Math.random();

    return date.getTime() + email + Math.floor(random * 10e4);
}

