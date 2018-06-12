var mongodb = require('mongodb');
var Q = require('q');

var mongoHost = process.env.mongo_host || '127.0.0.1';
var mongoPort = process.env.mongo_port || 27017;

var server = new mongodb.Server(mongoHost, mongoPort, {});
var db = new mongodb.Db('grub', server, {});
var deferred = Q.defer();
db.isDbReady = deferred.promise;
db.open(function() {deferred.resolve(true);});

module.exports = db;

