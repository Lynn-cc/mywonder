var express = require('express'),
    mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;

var app = express();

var db = new Db('wonder',
    new Server('localhost', 27017, { auto_reconnect: true }));

db.open(function(err, db) {
        if (!err) {
            app.listen(8888);
            console.log('Database is ok, Listening on port 8888');
        } else {
            console.log(err);
        }
});

app.use(express.logger());
app.use(express.bodyParser());

app.post('/signup', function(req, res) {
        console.log('accept request of /signup');

        signup(req, function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(results);
                }
        });
});

function signup(req, callback) {
    try {
        var body = req.body,
            headers = req.headers,
        userObj = {
            email : body['email'],
            password : body['password'],
            ua : headers['x-wonder-user-agent']
        };

        db.collection('user', function(err, collection) {
                console.log('open collection, start inserting');
                if (!err) {
                    collection.find({
                            email: userObj.email
                    }).toArray(function(err, item) {
                            if (item.length) {
                                console.log('user is already exits');
                                callback('', '{ "code": 2, "reason": "Email is already exits"}');
                            } else {
                                collection.insert(userObj, function(err, results) {
                                        if (!err) {
                                            console.log('user has been saved')
                                            callback('', '{ "code": 0, "uid": "cccccc" }');
                                        } else {
                                            console.log(err);
                                            callback(err, '{ "code": 2, "reason": "Saving wrong!" }');
                                        }
                                });
                            }
                    });
                } else {
                    console.log(err);
                    callback(err, '{ "code": 2, "reason": "Saving wrong!" }');
                }
        });
    } catch (e) {
        callback('{"code": 3, "reason": "' + e + '"}');
    }
}
