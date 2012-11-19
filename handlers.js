var db = require('./db.js'),
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

            var code = 0,
            uid = 0,
            test;

            if (err) { throw err; }

            test = testing(userObj);

            if (!test) {
                code = 1;
            } else {

                collection.find({
                    email: userObj.email
                }).toArray(function(err, item) {

                    if (item.length) {
                        console.log('user is already exits');
                        code = 2;
                    } else {
                        userObj.uid = buildUid(body['email']);

                        collection.insert(userObj, function(err, results) {
                            if (err) { throw err; }

                            console.log('user has been saved')
                            uid = userObj.uid;
                        });
                    }
                });
            }

            callback('', {
                code: code,
                reason: errStr[code],
                uid: userObj.uid || ''
            });

        });

    } catch (e) {
        console.log(e);
        callback(e, serverErrObj);
    }
};

function testing(userObj) {
    return true;
}

function buildUid(email) {
    var date = new Date(),
    random = Math.random();

    var str = date.getTime() + Math.floor(random * 10e4);

    return 
}
