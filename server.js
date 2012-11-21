/** todo
 * log file
 * 防注入？
 **/

var express = require('express'),
app = express(),
db = require('./db.js').db,
handlers = require('./handlers.js');

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
    console.log('accepted request of /signup');

    handlers.signup(req, function(err, results) {
        if (err) {
            res.json(500, results);
            console.log('response status code 500');
        } else {
            res.json(200, results);
            console.log('sended response of /signup')
        }
    });
});

app.post('/login', function(req, res) {
    console.log('accepted request of /login');

    handlers.login(req, function(err, results) {
        if (err) {
            res.json(500, results);
            console.log('response status code 500');
        } else {
            res.json(200, results);
            console.log('sended response of /login')
        }
    });
});

