var mongo = require('mongodb'),
Server = mongo.Server,
Db = mongo.Db;

var db = new Db('wonder',
new Server('localhost', 27017, { auto_reconnect: true }));

exports.db = db;
