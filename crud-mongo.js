/* eslint-disable */

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var assert = require('assert');
//var url = 'mongodb://localhost:27017/test';

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'sensors';

exports.connexionMongo = function(callback) {
	MongoClient.connect(url, function(err, client) {
		console.log(client);
		var db = client.db(dbName);

		assert.equal(null, err);
		callback(err, db);
	});
}

exports.countAllLines = function(name,callback) {
	MongoClient.connect(url, function(err, client) {
		let db = client.db(dbName);

		console.log("db " + db)
		if(!err){
			if(name==''){
				db.collection('temp')
					.count()
					.then(rep => callback(rep));
			}else {
				let query = {
					"name" : {$regex:".*"+name+".*",$options:"i"}
				}
				db.collection('temp')
					.find(query)
					.count()
					.then(rep => callback(rep));

			}
		}
	});
};

exports.getLastUpdate = function(name,callback) {
	MongoClient.connect(url, function(err, client) {
		let db = client.db(dbName);

		console.log("db " + db)
		if(!err){
			if(name==''){
				db.collection('temp')
					.find({})
					.sort({$natural:-1})
					.toArray()
					.then(rep => callback(rep));
			}else {
				let query = {
					"name" : {$regex:".*"+name+".*",$options:"i"}
				}
				db.collection('temp')
					.find({})
					.sort({$natural:-1})
					.toArray()
					.then(rep => callback(rep));
			}
		}
	});
};
