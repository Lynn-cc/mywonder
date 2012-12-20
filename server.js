var express = require('express'),
app = express(),
db = require('./db.js').db,
handlers = require('./handlers.js'),
log = require('./log.js').log,
logType = require('./log.js').types;

db.open(function(err, db) {
    if (!err) {
        app.listen(8888);
        log('Database is ok, Listening on port 8888');
    } else {
        log(logType.ERROR, err);
    }
});

app.use(express.logger());
app.use(express.bodyParser());

app.post('/signup', function(req, res) {
    log('accepted request of /signup');

    handlers.signup(req, function(err, results) {
        if (err) {
            res.json(500, results);
            log('response status code 500');
        } else {
            res.json(200, results);
            log('sended response of /signup')
        }
    });
});

app.post('/login', function(req, res) {
    log('accepted request of /login');

    handlers.login(req, function(err, results) {
        if (err) {
            res.json(500, results);
            log('response status code 500');
        } else {
            res.json(200, results);
            log('sended response of /login')
        }
    });
});

app.post('/logout', function(req, res) {
    log('accepted request of /logout');

    handlers.logout(req, function(err, results) {
        if (err) {
            res.json(500, results);
            log('response status code 500');
        } else {
            res.json(200, results);
            log('sended response of /logout')
        }
    });
});

app.post('/sync', function(req, res) {
    log('accepted request of /sync');

    handlers.sync(req, function(err, results) {
        if (err) {
            res.json(500, results);
            log('response status code 500');
        } else {
            res.json(200, results);
            log('sended response of /sync')
        }
    });
});


